SELECT COUNT(*) as count
FROM subscriptions
WHERE type = 'subscription_created' AND date >= @startDate;
