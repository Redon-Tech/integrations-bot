UPDATE stats 
SET totalSales = totalSales + 1,
    totalRevenue = totalRevenue + @amount
WHERE id = 1;
