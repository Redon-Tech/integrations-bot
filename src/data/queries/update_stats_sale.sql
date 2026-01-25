UPDATE stats 
SET total_sales = total_sales + 1,
    total_revenue = total_revenue + @amount
WHERE id = 1;
