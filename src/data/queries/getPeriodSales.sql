SELECT COUNT(*) as count, SUM(amount) as revenue
FROM sales
WHERE type = 'sale' AND date >= @startDate;
