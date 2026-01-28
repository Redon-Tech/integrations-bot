---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# Database Schema

This bot uses a simple SQLite database to store sales, refunds, subscriptions, and statistics. Below is a description of each table and its columns.

## Tables

### stats
Tracks overall statistics for sales, refunds, revenue, and subscriptions.

| Column          | Type    | Description                                 |
|-----------------|---------|---------------------------------------------|
| id              | INTEGER | Always 1 (single row for stats)             |
| totalSales      | INTEGER | Total number of sales                       |
| totalRevenue    | REAL    | Total revenue from sales                    |
| totalRefunds    | INTEGER | Total number of refunds                     |
| refundedAmount  | REAL    | Total amount refunded                       |
| subscriptions   | INTEGER | Total number of subscriptions               |

```sql
CREATE TABLE IF NOT EXISTS stats (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	totalSales INTEGER DEFAULT 0,
	totalRevenue REAL DEFAULT 0,
	totalRefunds INTEGER DEFAULT 0,
	refundedAmount REAL DEFAULT 0,
	subscriptions INTEGER DEFAULT 0
);
```

### sales
Stores all sales and refund records.

| Column        | Type   | Description                                 |
|---------------|--------|---------------------------------------------|
| id            | TEXT   | Unique sale or refund ID                    |
| type          | TEXT   | 'sale' or 'refund'                          |
| products      | TEXT   | Product names (comma-separated)             |
| amount        | REAL   | Sale or refund amount                       |
| currency      | TEXT   | Currency code (default 'USD')               |
| customer      | TEXT   | Customer name or ID                         |
| date          | TEXT   | ISO date string                             |
| coupon        | TEXT   | Coupon code used (if any)                   |
| discount      | REAL   | Discount amount (if any)                    |
| originalDate  | TEXT   | Original sale date (for refunds)            |

```sql
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
	originalDate TEXT
);
```

### subscriptions
Stores all subscription records.

| Column    | Type   | Description                                 |
|-----------|--------|---------------------------------------------|
| id        | TEXT   | Unique subscription ID                      |
| type      | TEXT   | Subscription event type                     |
| product   | TEXT   | Product name                                |
| plan      | TEXT   | Subscription plan name                      |
| customer  | TEXT   | Customer name or ID                         |
| date      | TEXT   | ISO date string                             |

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
	id TEXT PRIMARY KEY,
	type TEXT NOT NULL,
	product TEXT,
	plan TEXT,
	customer TEXT,
	date TEXT NOT NULL
);
```

## Indexes

Indexes are used to speed up queries on date and type columns.

```sql
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(date);
CREATE INDEX IF NOT EXISTS idx_sales_type ON sales(type);
CREATE INDEX IF NOT EXISTS idx_subscriptions_date ON subscriptions(date);
```

---

> **Note:** Editing the schema is not recommended unless you know what you are doing. For query details, see [queries.md](queries.md).
