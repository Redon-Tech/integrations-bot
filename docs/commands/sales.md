---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# `/sales` Command

The `/sales` command allows server administrators to view recent sales, refunds, and subscription events tracked by the bot. Results are displayed in a paginated embed with navigation buttons for easy browsing.

## Usage

```
/sales [count:<number>] [filter:<period>]
```

### Options
- **count** (integer, optional): Number of sales to show (10-100). Defaults to 10 if not specified.
- **filter** (string, optional): Filter sales by time period. Choices:
	- `all` (default): All time
	- `today`: Only today's sales
	- `week`: Only this week's sales

## Permissions
Only users with the **Administrator** permission can use this command. Non-admins will receive an error message.

## Behavior
- Fetches recent sales, refunds, and subscription events from the database using the selected filter and count.
- Results are shown in a paginated embed (10 per page) with navigation buttons (First, Previous, Next, Last).
- Each entry includes product, customer, date, and amount. Refunds and subscriptions are clearly labeled.
- If no results are found for the selected filter, a message is shown.
- Only the user who invoked the command can use the navigation buttons.
- Buttons are disabled after 5 minutes of inactivity.

## Example

```
/sales count:20 filter:today
```

## Notes
- The total number of tracked transactions is shown in the embed footer.
- Data is pulled from the bot's internal sales database.
- For more details on sales tracking, see the bot's documentation or contact the maintainers.
