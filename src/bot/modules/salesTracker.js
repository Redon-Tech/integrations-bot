const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const botLogger = require('./botLogger');
const config = require('../../config/config.json');

const DATA_DIR = path.join(__dirname, '../../data');
const SCHEMA_DIR = path.join(DATA_DIR, 'schema');
const QUERIES_DIR = path.join(DATA_DIR, 'queries');
const DB_FILE = path.join(DATA_DIR, 'sales.db');

class SalesTracker {
    constructor() {
        this.maxSales = config.databaseConfig?.maxSales || 200;
        this.ensureDataDirectory();
        this.db = new Database(DB_FILE);
        this.queries = this.loadQueries();
        this.initializeDatabase();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            botLogger.log('Created data directory');
        }
    }

    loadQueries() {
        const queries = {};
        const queryFiles = [
            'insert_sale',
            'insert_refund',
            'insert_subscription',
            'update_stats_sale',
            'update_stats_refund',
            'update_stats_subscription',
            'get_all_stats',
            'get_period_sales',
            'get_period_refunds',
            'get_period_subscriptions',
            'get_products_for_top_list',
            'cleanup_old_records'
        ];

        queryFiles.forEach(file => {
            const queryPath = path.join(QUERIES_DIR, `${file}.sql`);
            if (fs.existsSync(queryPath)) {
                queries[file] = fs.readFileSync(queryPath, 'utf-8').trim();
            } else {
                botLogger.log(`Warning: Query file not found: ${file}.sql`, 'WARN');
            }
        });

        return queries;
    }

    initializeDatabase() {
        // Execute SQL schema files
        const schemaFiles = [
            'create_sales_table.sql',
            'create_subscriptions_table.sql',
            'create_stats_table.sql',
            'create_indexes.sql'
        ];

        schemaFiles.forEach(file => {
            const schemaPath = path.join(SCHEMA_DIR, file);
            if (fs.existsSync(schemaPath)) {
                const sql = fs.readFileSync(schemaPath, 'utf-8');
                this.db.exec(sql);
                botLogger.log(`Executed schema: ${file}`);
            } else {
                botLogger.log(`Warning: Schema file not found: ${file}`, 'WARN');
            }
        });

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
        this.db.prepare(this.queries.insert_sale).run(sale);

        // Update stats
        this.db.prepare(this.queries.update_stats_sale).run({ amount: sale.amount });

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
        this.db.prepare(this.queries.insert_refund).run(refund);

        // Update stats
        this.db.prepare(this.queries.update_stats_refund).run({ amount: refund.amount });

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
        this.db.prepare(this.queries.insert_subscription).run(subscription);

        // Update stats if new subscription
        if (eventType === 'subscription.created') {
            this.db.prepare(this.queries.update_stats_subscription).run();
        }

        // Clean up old subscriptions
        this.cleanupOldRecords('subscriptions');

        botLogger.log(`Tracked subscription: ${subscription.id} - ${subscription.type}`);
    }

    cleanupOldRecords(table) {
        const count = this.db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
        if (count > this.maxSales) {
            const toDelete = count - this.maxSales;
            const query = this.queries.cleanup_old_records.replace(/{table}/g, table);
            this.db.prepare(query).run({ toDelete });
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
        const statsRow = this.db.prepare(this.queries.get_all_stats).get();
        
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
            const salesData = this.db.prepare(this.queries.get_period_sales).get({ startDate: today.toISOString() });
            const refundData = this.db.prepare(this.queries.get_period_refunds).get({ startDate: today.toISOString() });
            const subscriptionData = this.db.prepare(this.queries.get_period_subscriptions).get({ startDate: today.toISOString() });
            
            stats.periodSales = salesData.count || 0;
            stats.periodRevenue = salesData.revenue || 0;
            stats.periodRefunds = refundData.count || 0;
            stats.periodRefunded = refundData.refunded || 0;
            stats.periodSubscriptions = subscriptionData.count || 0;
        } else if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const salesData = this.db.prepare(this.queries.get_period_sales).get({ startDate: weekAgo.toISOString() });
            const refundData = this.db.prepare(this.queries.get_period_refunds).get({ startDate: weekAgo.toISOString() });
            const subscriptionData = this.db.prepare(this.queries.get_period_subscriptions).get({ startDate: weekAgo.toISOString() });
            
            stats.periodSales = salesData.count || 0;
            stats.periodRevenue = salesData.revenue || 0;
            stats.periodRefunds = refundData.count || 0;
            stats.periodRefunded = refundData.refunded || 0;
            stats.periodSubscriptions = subscriptionData.count || 0;
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            const salesData = this.db.prepare(this.queries.get_period_sales).get({ startDate: monthAgo.toISOString() });
            const refundData = this.db.prepare(this.queries.get_period_refunds).get({ startDate: monthAgo.toISOString() });
            const subscriptionData = this.db.prepare(this.queries.get_period_subscriptions).get({ startDate: monthAgo.toISOString() });
            
            stats.periodSales = salesData.count || 0;
            stats.periodRevenue = salesData.revenue || 0;
            stats.periodRefunds = refundData.count || 0;
            stats.periodRefunded = refundData.refunded || 0;
            stats.periodSubscriptions = subscriptionData.count || 0;
        }

        return stats;
    }

    getTopProducts(limit = 5) {
        const sales = this.db.prepare(this.queries.get_products_for_top_list).all();

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