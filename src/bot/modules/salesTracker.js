const fs = require('fs');
const path = require('path');
const botLogger = require('./botLogger');

const DATA_DIR = path.join(__dirname, '../../data');
const SALES_FILE = path.join(DATA_DIR, 'sales.json');
const MAX_SALES = 200; // Keep last 200 sales

class SalesTracker {
    constructor() {
        this.ensureDataDirectory();
        this.data = this.loadData();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
            botLogger.log('Created data directory');
        }
    }

    loadData() {
        if (fs.existsSync(SALES_FILE)) {
            try {
                const rawData = fs.readFileSync(SALES_FILE, 'utf8');
                return JSON.parse(rawData);
            } catch (error) {
                botLogger.logError('Failed to load sales data', error);
                return this.getDefaultData();
            }
        }
        return this.getDefaultData();
    }

    getDefaultData() {
        return {
            sales: [],
            stats: {
                totalSales: 0,
                totalRevenue: 0,
                totalRefunds: 0,
                refundedAmount: 0,
                subscriptions: 0
            }
        };
    }

    saveData() {
        try {
            fs.writeFileSync(SALES_FILE, JSON.stringify(this.data, null, 2));
        } catch (error) {
            botLogger.logError('Failed to save sales data', error);
        }
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

        this.data.sales.unshift(sale); // Add to beginning
        if (this.data.sales.length > MAX_SALES) {
            this.data.sales = this.data.sales.slice(0, MAX_SALES);
        }

        this.data.stats.totalSales++;
        this.data.stats.totalRevenue += sale.amount;

        this.saveData();
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
            originalDate: webhookData.date_purchased
        };

        this.data.sales.unshift(refund);
        if (this.data.sales.length > MAX_SALES) {
            this.data.sales = this.data.sales.slice(0, MAX_SALES);
        }

        this.data.stats.totalRefunds++;
        this.data.stats.refundedAmount += refund.amount;

        this.saveData();
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

        this.data.sales.unshift(subscription);
        if (this.data.sales.length > MAX_SALES) {
            this.data.sales = this.data.sales.slice(0, MAX_SALES);
        }

        if (eventType === 'subscription.created') {
            this.data.stats.subscriptions++;
        }

        this.saveData();
        botLogger.log(`Tracked subscription: ${subscription.id} - ${subscription.type}`);
    }

    getRecentSales(count = 10, filter = 'all') {
        let sales = this.data.sales;

        if (filter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            sales = sales.filter(s => new Date(s.date) >= today);
        } else if (filter === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            sales = sales.filter(s => new Date(s.date) >= weekAgo);
        }

        return sales.slice(0, count);
    }

    getStats(period = 'all') {
        const stats = {
            totalSales: this.data.stats.totalSales,
            totalRevenue: this.data.stats.totalRevenue,
            totalRefunds: this.data.stats.totalRefunds,
            refundedAmount: this.data.stats.refundedAmount,
            subscriptions: this.data.stats.subscriptions,
            netRevenue: this.data.stats.totalRevenue - this.data.stats.refundedAmount,
            averageOrderValue: this.data.stats.totalSales > 0 
                ? this.data.stats.totalRevenue / this.data.stats.totalSales 
                : 0,
            refundRate: this.data.stats.totalSales > 0
                ? (this.data.stats.totalRefunds / this.data.stats.totalSales) * 100
                : 0
        };

        // Add period-specific stats
        if (period === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todaySales = this.data.sales.filter(s => 
                s.type === 'sale' && new Date(s.date) >= today
            );
            stats.periodSales = todaySales.length;
            stats.periodRevenue = todaySales.reduce((sum, s) => sum + s.amount, 0);
        } else if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weekSales = this.data.sales.filter(s => 
                s.type === 'sale' && new Date(s.date) >= weekAgo
            );
            stats.periodSales = weekSales.length;
            stats.periodRevenue = weekSales.reduce((sum, s) => sum + s.amount, 0);
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setDate(monthAgo.getDate() - 30);
            const monthSales = this.data.sales.filter(s => 
                s.type === 'sale' && new Date(s.date) >= monthAgo
            );
            stats.periodSales = monthSales.length;
            stats.periodRevenue = monthSales.reduce((sum, s) => sum + s.amount, 0);
        }

        return stats;
    }

    getTopProducts(limit = 5) {
        const productCounts = {};
        
        this.data.sales.forEach(sale => {
            if (sale.type === 'sale' && sale.products) {
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
}

// Export singleton instance
module.exports = new SalesTracker();
