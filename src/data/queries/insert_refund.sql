INSERT OR REPLACE INTO sales (id, type, products, amount, currency, customer, date, original_date)
VALUES (@id, @type, @products, @amount, @currency, @customer, @date, @original_date);
