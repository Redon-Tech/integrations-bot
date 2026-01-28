---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# `/test` Command

The `/test` command allows server administrators to send test webhook notifications to the bot's webhook endpoint. This is useful for verifying webhook handling and integration without making real purchases or subscription changes.

## Usage

```
/test type:<event_type>
```

### Options
- **type** (string, required): The type of webhook event to test. Choices:
	- `paid`: Simulate a paid sale event
	- `subscription_created`: Simulate a subscription creation event
	- `subscription_deleted`: Simulate a subscription cancellation event
	- `refunded`: Simulate a refund event

## Permissions
Only users with the **Administrator** permission can use this command. Non-admins will receive an error message.

## Behavior
- Sends a test webhook payload to the configured local webhook endpoint (as set in `config.json`).
- Replies with the result of the webhook request (success or error message).
- No real data is affected; all payloads are mock/test data.

## Example

```
/test type:paid
```

## Notes
- Ensure the bot's webhook server is running and accessible at the configured endpoint.
- For more details on webhook testing, see the bot's documentation or contact the maintainers.
