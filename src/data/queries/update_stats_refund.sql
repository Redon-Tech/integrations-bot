UPDATE stats 
SET total_refunds = total_refunds + 1,
    refunded_amount = refunded_amount + @amount
WHERE id = 1;
