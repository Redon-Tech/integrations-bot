// Test script to verify all database queries work correctly
const salesTracker = require('./src/bot/modules/salesTracker');

console.log('=== Testing Database Queries ===\n');

// Test 1: Track a sale
console.log('Test 1: Tracking a sale...');
try {
    salesTracker.trackSale({
        transaction_id: 'TEST_SALE_001',
        products: 'Test Product A, Test Product B',
        total_price: '99.99',
        currency: 'USD',
        customer: 'test@example.com',
        coupon: 'TESTCODE',
        discount: '10.00'
    });
    console.log('✅ Sale tracked successfully\n');
} catch (error) {
    console.error('❌ Error tracking sale:', error.message, '\n');
}

// Test 2: Track a refund
console.log('Test 2: Tracking a refund...');
try {
    salesTracker.trackRefund({
        transaction_id: 'TEST_REFUND_001',
        products: 'Test Product C',
        refund_amount: '49.99',
        total_price: '49.99',
        currency: 'USD',
        customer: 'refund@example.com',
        date_purchased: new Date(Date.now() - 86400000).toISOString()
    });
    console.log('✅ Refund tracked successfully\n');
} catch (error) {
    console.error('❌ Error tracking refund:', error.message, '\n');
}

// Test 3: Track a subscription
console.log('Test 3: Tracking a subscription...');
try {
    salesTracker.trackSubscription({
        subscription_id: 'TEST_SUB_001',
        product: 'Premium Plan',
        subscription_plan: 'Monthly',
        customer: 'subscriber@example.com'
    }, 'subscription.created');
    console.log('✅ Subscription tracked successfully\n');
} catch (error) {
    console.error('❌ Error tracking subscription:', error.message, '\n');
}

// Test 4: Get all stats
console.log('Test 4: Getting all-time stats...');
try {
    const allStats = salesTracker.getStats('all');
    console.log('✅ All-time stats retrieved:');
    console.log(`   - Total Sales: ${allStats.totalSales}`);
    console.log(`   - Total Revenue: $${allStats.totalRevenue.toFixed(2)}`);
    console.log(`   - Total Refunds: ${allStats.totalRefunds}`);
    console.log(`   - Refunded Amount: $${allStats.refundedAmount.toFixed(2)}`);
    console.log(`   - Net Revenue: $${allStats.netRevenue.toFixed(2)}`);
    console.log(`   - Average Order Value: $${allStats.averageOrderValue.toFixed(2)}`);
    console.log(`   - Subscriptions: ${allStats.subscriptions}\n`);
} catch (error) {
    console.error('❌ Error getting all stats:', error.message, '\n');
}

// Test 5: Get today's stats
console.log('Test 5: Getting today\'s stats...');
try {
    const todayStats = salesTracker.getStats('today');
    console.log('✅ Today\'s stats retrieved:');
    console.log(`   - Period Sales: ${todayStats.periodSales || 0}`);
    console.log(`   - Period Revenue: $${(todayStats.periodRevenue || 0).toFixed(2)}`);
    console.log(`   - Period Refunds: ${todayStats.periodRefunds || 0}`);
    console.log(`   - Period Subscriptions: ${todayStats.periodSubscriptions || 0}\n`);
} catch (error) {
    console.error('❌ Error getting today stats:', error.message, '\n');
}

// Test 6: Get top products
console.log('Test 6: Getting top products...');
try {
    const topProducts = salesTracker.getTopProducts(5);
    console.log('✅ Top products retrieved:');
    if (topProducts.length > 0) {
        topProducts.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.product} - ${p.count} sales`);
        });
    } else {
        console.log('   No products found');
    }
    console.log();
} catch (error) {
    console.error('❌ Error getting top products:', error.message, '\n');
}

// Test 7: Get recent sales
console.log('Test 7: Getting recent sales...');
try {
    const recentSales = salesTracker.getRecentSales(5);
    console.log('✅ Recent sales retrieved:');
    console.log(`   Found ${recentSales.length} recent sales\n`);
} catch (error) {
    console.error('❌ Error getting recent sales:', error.message, '\n');
}

// Test 8: Test cleanup (check count)
console.log('Test 8: Checking database count...');
try {
    const count = salesTracker.db.prepare('SELECT COUNT(*) as count FROM sales').get().count;
    console.log(`✅ Current sales count: ${count}`);
    console.log(`   Max allowed: ${salesTracker.maxSales}\n`);
} catch (error) {
    console.error('❌ Error checking count:', error.message, '\n');
}

console.log('=== All Tests Complete ===');
console.log('\nClosing database connection...');
salesTracker.close();
console.log('Done!');
