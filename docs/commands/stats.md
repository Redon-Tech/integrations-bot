
---
title: Stats Command
authors:
	- MiataVxbe
hide:
	- navigation
---

# `/stats` Command

The `/stats` command allows server administrators to view sales statistics, including sales, refunds, revenue, and subscriptions, for different time periods. Results are shown in a detailed embed with top products and summary metrics.

## Usage

```
/stats [period:<period>]
```

### Options
- **period** (string, optional): Time period for statistics. Choices:
	- `all` (default): All time
	- `today`: Today only
	- `week`: This week
	- `month`: This month

## Permissions
Only users with the **Administrator** permission can use this command. Non-admins will receive an error message.

## Behavior
- Fetches statistics for the selected period, including:
	- Total sales, refunds, and net revenue
	- Average order value and refund rate
	- Number of subscriptions
	- Top 5 products by sales
- Results are shown in a single embed with a summary and top products list.
- The total number of tracked transactions is shown in the embed footer.

## Example

```
/stats period:week
```

## Notes
- Data is pulled from the bot's internal sales database.
- For more details on statistics, see the bot's documentation or contact the maintainers.
