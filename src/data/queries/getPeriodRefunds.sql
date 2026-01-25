SELECT COUNT(*) as count, SUM(amount) as refunded
FROM sales
WHERE type = 'refund' AND date >= @startDate;
