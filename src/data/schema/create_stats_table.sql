CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    totalSales INTEGER DEFAULT 0,
    totalRevenue REAL DEFAULT 0,
    totalRefunds INTEGER DEFAULT 0,
    refundedAmount REAL DEFAULT 0,
    subscriptions INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO stats (id, totalSales, totalRevenue, totalRefunds, refundedAmount, subscriptions)
VALUES (1, 0, 0, 0, 0, 0);
