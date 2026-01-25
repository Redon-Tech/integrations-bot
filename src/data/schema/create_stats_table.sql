CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total_sales INTEGER DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    total_refunds INTEGER DEFAULT 0,
    refunded_amount REAL DEFAULT 0,
    subscriptions INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO stats (id, total_sales, total_revenue, total_refunds, refunded_amount, subscriptions)
VALUES (1, 0, 0, 0, 0, 0);
