const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const botLogger = require('./botLogger');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'sales.db');
const MAX_SALES = 200;

class SalesTracker {
    constructor() {
        this.ensureDataDirectory();
        this.db = new Database(DB_FILE);
        this.initializeDatabase();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            botLogger.log('Created data directory');
        }
    }

    initializeDatabase() {
        // Create sales table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS sales (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                products TEXT,
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'USD',
                customer TEXT,
                date TEXT NOT NULL,
                coupon TEXT,
                discount REAL DEFAULT 0,
                original_date TEXT
            )
        `);

        // Create subscriptions table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                product TEXT,
                plan TEXT,
                customer TEXT,
                date TEXT NOT NULL
            )
        `);

        // Create stats table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                total_sales INTEGER DEFAULT 0,
                total_revenue REAL DEFAULT 0,
                total_refunds INTEGER DEFAULT 0,
                refunded_amount REAL DEFAULT 0,
                subscriptions INTEGER DEFAULT 0
            )
        `);

        // Initialize stats if not exists
        const stats = this.db.prepare('SELECT * FROM stats WHERE id = 1').get();
        if (!stats) {
            this.db.prepare(`
                INSERT INTO stats (id, total_sales, total_revenue, total_refunds, refunded_amount, subscriptions)
                VALUES (1, 0, 0, 0, 0, 0)
            `).run();
        }

        // Create indexes for better performance
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
            CREATE INDEX IF NOT EXISTS idx_sales_type ON sales(type);
            CREATE INDEX IF NOT EXISTS idx_subscriptions_date ON subscriptions(date);
        `);

        botLogger.log('SQLite database initialized');
    }

    trackSale(webhookData) {
        const sale = {
            id: webhookData.transaction_id || Date.now().toString(),
            type: 'sale',
            products: webhookData.products,
            amount: parseFloat(webhookData.total_price),
            currency: webhookData.currency || 'USD',
            customer: webhookData.customer,
            date: new Date().toISOString(),
            coupon: webhookData.coupon || null,
            discount: webhookData.discount ? parseFloat(webhookData.discount) : 0
        };

        // Insert sale
        this.db.prepare(`
            INSERT OR REPLACE INTO sales (id, type, products, amount, currency, customer, date, coupon, discount)
            VALUES (@id, @type, @products, @amount, @currency, @customer, @date, @coupon, @discount)
        `).run(sale);

        // Update stats
        this.db.prepare(`
            UPDATE stats 
            SET total_sales = total_sales + 1,
                total_revenue = total_revenue + @amount
            WHERE id = 1
        `).run({ amount: sale.amount });

        // Clean up old sales (keep only MAX_SALES most recent)
        this.cleanupOldRecords('sales');

        botLogger.log(`Tracked sale: ${sale.id} - $${sale.amount}`);
    }

    trackRefund(webhookData) {
        const refund = {
            id: webhookData.transaction_id || Date.now().toString(),
            type: 'refund',
            products: webhookData.products,
            amount: parseFloat(webhookData.refund_amount || webhookData.total_price),
            currency: webhookData.currency || 'USD',
            customer: webhookData.customer,
            date: new Date().toISOString(),
            original_date: webhookData.date_purchased
        };

        // Insert refund
        this.db.prepare(`
            INSERT OR REPLACE INTO sales (id, type, products, amount, currency, customer, date, original_date)
            VALUES (@id, @type, @products, @amount, @currency, @customer, @date, @original_date)
        `).run(refund);

        // Update stats
        this.db.prepare(`
            UPDATE stats 
            SET total_refunds = total_refunds + 1,
                refunded_amount = refunded_amount + @amount
            WHERE id = 1
        `).run({ amount: refund.amount });

        // Clean up old sales
        this.cleanupOldRecords('sales');

        botLogger.log(`Tracked refund: ${refund.id} - $${refund.amount}`);
    }

    trackSubscription(webhookData, eventType) {
        const subscription = {
            id: webhookData.subscription_id || Date.now().toString(),
            type: eventType === 'subscription.created' ? 'subscription_created' : 'subscription_cancelled',
            product: webhookData.product,
            plan: webhookData.subscription_plan,
            customer: webhookData.customer,
            date: new Date().toISOString()
        };

        // Insert subscription
        this.db.prepare(`
            INSERT OR REPLACE INTO subscriptions (id, type, product, plan, customer, date)
            VALUES (@id, @type, @product, @plan, @customer, @date)
        `).run(subscription);

        // Update stats if new subscription
        if (eventType === 'subscription.created') {
            this.db.prepare(`
                UPDATE stats 
                SET subscriptions = subscriptions + 1
                WHERE id = 1
            `).run();
        }

        // Clean up old subscriptions
        this.cleanupOldRecords('subscriptions');

        botLogger.log(`Tracked subscription: ${subscription.id} - ${subscription.type}`);
    }

    cleanupOldRecords(table) {
        const count = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
        if (count > MAX_SALES) {
            const toDelete = count - MAX_SALES;
            this.db.prepare(`
                DELETE FROM ${table} 
                WHERE id IN (
                    SELECT id FROM ${table} 
                    ORDER BY date ASC 
                    LIMIT @toDelete
                )
            `).run({ toDelete });
        }
    }

    getRecentSales(count = 10, filter = 'all') {
        let query = `
            SELECT * FROM sales 
            WHERE 1=1
        `;
        const params = {};

        if (filter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query += ` AND date >= @startDate`;
            params.startDate = today.toISOString();
        } else if (filter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            query += ` AND date >= @startDate`;
            params.startDate = weekAgo.toISOString();
        }

        query += ` ORDER BY date DESC LIMIT @count`;
        params.count = count;

        return this.db.prepare(query).all(params);
    }

    getStats(period = 'all') {
        const statsRow = this.db.prepare('SELECT * FROM stats WHERE id = 1').get();
        
        const stats = {
            totalSales: statsRow.total_sales,
            totalRevenue: statsRow.total_revenue,
            totalRefunds: statsRow.total_refunds,
            refundedAmount: statsRow.refunded_amount,
            subscriptions: statsRow.subscriptions,
            netRevenue: statsRow.total_revenue - statsRow.refunded_amount,
            averageOrderValue: statsRow.total_sales > 0 
                ? statsRow.total_revenue / statsRow.total_sales 
                : 0,
            refundRate: statsRow.total_sales > 0
                ? (statsRow.total_refunds / statsRow.total_sales) * 100
                : 0
        };

        // Add period-specific stats
        if (period === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const periodData = this.db.prepare(`
                SELECT COUNT(*) as count, SUM(amount) as revenue
                FROM sales
                WHERE type = 'sale' AND date >= @startDate
            `).get({ startDate: today.toISOString() });
            stats.periodSales = periodData.count || 0;
            stats.periodRevenue = periodData.revenue || 0;
        } else if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const periodData = this.db.prepare(`
                SELECT COUNT(*) as count, SUM(amount) as revenue
                FROM sales
                WHERE type = 'sale' AND date >= @startDate
            `).get({ startDate: weekAgo.toISOString() });
            stats.periodSales = periodData.count || 0;
            stats.periodRevenue = periodData.revenue || 0;
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            const periodData = this.db.prepare(`
                SELECT COUNT(*) as count, SUM(amount) as revenue
                FROM sales
                WHERE type = 'sale' AND date >= @startDate
            `).get({ startDate: monthAgo.toISOString() });
            stats.periodSales = periodData.count || 0;
            stats.periodRevenue = periodData.revenue || 0;
        }

        return stats;
    }

    getTopProducts(limit = 5) {
        const sales = this.db.prepare(`
            SELECT products FROM sales WHERE type = 'sale' AND products IS NOT NULL
        `).all();

        const productCounts = {};
        
        sales.forEach(sale => {
            if (sale.products) {
                const products = sale.products.split(',').map(p => p.trim());
                products.forEach(product => {
                    // Remove (SALE) tag if present
                    const cleanProduct = product.replace(/\s*\(SALE\)\s*/g, '').trim();
                    productCounts[cleanProduct] = (productCounts[cleanProduct] || 0) + 1;
                });
            }
        });

        return Object.entries(productCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([product, count]) => ({ product, count }));
    }

    close() {
        this.db.close();
    }
}

module.exports = new SalesTracker();