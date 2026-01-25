SELECT products 
FROM sales 
WHERE type = 'sale' AND products IS NOT NULL;
