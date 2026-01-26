# Database Queries

This bot uses external SQL files to manage all database operations. Below is a list of each query file, its purpose, and a brief description of its usage.

| Query File                  | Purpose                                                      |
|----------------------------|--------------------------------------------------------------|
| getAllStats.sql            | Fetches all statistics from the stats table.                 |
| getPeriodSales.sql         | Gets sales count and revenue for a given period.             |
| getPeriodRefunds.sql       | Gets refund count and total refunded amount for a period.    |
| getPeriodSubscriptions.sql | Gets subscription count for a given period.                  |
| getProductsForTopList.sql  | Retrieves product names from sales for top lists.            |
| insertSale.sql             | Inserts or updates a sale record.                            |
| insertRefund.sql           | Inserts or updates a refund record.                          |
| insertSubscription.sql     | Inserts or updates a subscription record.                    |
| updateStatsSale.sql        | Updates stats after a sale.                                  |
| updateStatsRefund.sql      | Updates stats after a refund.                                |
| updateStatsSubscription.sql| Updates stats after a subscription.                          |
| cleanupOldRecords.sql      | Deletes oldest records to maintain max record limits.        |

## Query Details

### getAllStats.sql
Fetches all statistics from the `stats` table.
```sql
SELECT * FROM stats WHERE id = 1;
```

### getPeriodSales.sql
Gets sales count and revenue for a given period.
```sql
SELECT COUNT(*) as count, SUM(amount) as revenue
FROM sales
WHERE type = 'sale' AND date >= @startDate;
```

### getPeriodRefunds.sql
Gets refund count and total refunded amount for a period.
```sql
SELECT COUNT(*) as count, SUM(amount) as refunded
FROM sales
WHERE type = 'refund' AND date >= @startDate;
```

### getPeriodSubscriptions.sql
Gets subscription count for a given period.
```sql
SELECT COUNT(*) as count
FROM subscriptions
WHERE type = 'subscription_created' AND date >= @startDate;
```

### getProductsForTopList.sql
Retrieves product names from sales for top lists.
```sql
SELECT products 
FROM sales 
WHERE type = 'sale' AND products IS NOT NULL;
```

### insertSale.sql
Inserts or updates a sale record.
```sql
INSERT OR REPLACE INTO sales (id, type, products, amount, currency, customer, date, coupon, discount)
VALUES (@id, @type, @products, @amount, @currency, @customer, @date, @coupon, @discount);
```

### insertRefund.sql
Inserts or updates a refund record.
```sql
INSERT OR REPLACE INTO sales (id, type, products, amount, currency, customer, date, originalDate)
VALUES (@id, @type, @products, @amount, @currency, @customer, @date, @originalDate);
```

### insertSubscription.sql
Inserts or updates a subscription record.
```sql
INSERT OR REPLACE INTO subscriptions (id, type, product, plan, customer, date)
VALUES (@id, @type, @product, @plan, @customer, @date);
```

### updateStatsSale.sql
Updates stats after a sale.
```sql
UPDATE stats 
SET totalSales = totalSales + 1,
	totalRevenue = totalRevenue + @amount
WHERE id = 1;
```

### updateStatsRefund.sql
Updates stats after a refund.
```sql
UPDATE stats 
SET totalRefunds = totalRefunds + 1,
	refundedAmount = refundedAmount + @amount
WHERE id = 1;
```

### updateStatsSubscription.sql
Updates stats after a subscription.
```sql
UPDATE stats 
SET subscriptions = subscriptions + 1
WHERE id = 1;
```

### cleanupOldRecords.sql
Deletes oldest records to maintain max record limits.
```sql
DELETE FROM {table} 
WHERE id IN (
	SELECT id FROM {table} 
	ORDER BY date ASC 
	LIMIT @toDelete
);
```

---

> **Note:** These queries are used internally by the bot. Editing them is not recommended unless you know what you are doing. For schema details, see [schema.md](schema.md).
