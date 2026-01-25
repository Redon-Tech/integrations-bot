CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    product TEXT,
    plan TEXT,
    customer TEXT,
    date TEXT NOT NULL
);
