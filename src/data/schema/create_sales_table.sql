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
