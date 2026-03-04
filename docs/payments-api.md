# Payments API

> **Source:** `views/payments/providers.mjs`  
> **Base URL:** `/v1/payment`

## Overview

The Payments API handles payment processing for NFT purchases, supporting Stripe and other payment providers. It manages payment intents, confirmations, and payment history records.

---

## Endpoints

### Create Payment Intent

```
POST /v1/payment/create-intent
```

Creates a Stripe payment intent for an NFT purchase. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `launchpadId` | `string` | Yes | Launchpad ID |
| `amount` | `number` | Yes | Payment amount (in cents) |
| `currency` | `string` | No | Currency code (default: `usd`) |

**Response:**
```json
{
  "clientSecret": "string",
  "paymentIntentId": "string"
}
```

---

### Confirm Payment

```
POST /v1/payment/confirm
```

Confirms a successful payment and creates a payment history record. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `paymentIntentId` | `string` | Yes | Stripe payment intent ID |
| `launchpadId` | `string` | Yes | Launchpad ID |

**Side Effects:**
- Creates `payment_history` record in Directus with status `APPROVED`
- Triggers NFT mint process
- Tracks Mixpanel event

---

### Get Payment History

```
POST /v1/payment/history
```

Fetches payment history for the authenticated user. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

**Response:** Array of payment history objects with amounts, dates, and launchpad info.

---

### Stripe Webhook

```
POST /v1/payment/webhook
```

Processes Stripe webhook events for payment lifecycle management.

**Handled Events:**
- `payment_intent.succeeded` — Marks payment as approved
- `payment_intent.payment_failed` — Marks payment as failed
- `charge.refunded` — Handles refund processing
