UPDATE stats 
SET totalRefunds = totalRefunds + 1,
    refundedAmount = refundedAmount + @amount
WHERE id = 1;
