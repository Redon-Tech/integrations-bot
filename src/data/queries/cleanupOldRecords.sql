DELETE FROM {table} 
WHERE id IN (
    SELECT id FROM {table} 
    ORDER BY date ASC 
    LIMIT @toDelete
);
