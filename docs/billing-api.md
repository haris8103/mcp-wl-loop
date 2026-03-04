# Billing API

> **Source:** `views/billing/index.mjs`  
> **Base URL:** `/v1/billing`

## Overview

The Billing API manages subscription plans including creation, updating, retrieval, and cancellation. It integrates with Stripe for payment processing and uses middleware for authentication and plan limits.

---

## Endpoints

### Get User Billing Info

```
GET /v1/billing
```

Fetches the current user's billing/subscription information. Requires authentication via `mustBeAuthenticated` middleware.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response:**
```json
{
  "plan": {
    "id": "string",
    "plan_name": "string",
    "status": "string",
    "stripe_subscription_id": "string",
    "plan_features": {}
  }
}
```

---

### Create Subscription

```
POST /v1/billing/create
```

Creates a new Stripe subscription for the user. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `plan_id` | `string` | Yes | Plan ID to subscribe to |
| `payment_method_id` | `string` | Yes | Stripe payment method ID |

**Side Effects:**
- Creates Stripe customer and subscription
- Records subscription in Directus
- Sends Mixpanel event

---

### Update Subscription

```
POST /v1/billing/update
```

Updates an existing subscription (e.g., change plan). Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `new_plan_id` | `string` | Yes | New plan ID |

---

### Cancel Subscription

```
POST /v1/billing/cancel
```

Cancels the user's active subscription. Requires authentication.

**Side Effects:**
- Cancels Stripe subscription
- Updates subscription status in Directus
- Sends Mixpanel event

---

### Get Available Plans

```
GET /v1/billing/plans
```

Fetches all available subscription plans.

**Response:** Array of plan objects with features and pricing.

---

### Stripe Webhook

```
POST /v1/billing/webhook
```

Handles Stripe webhook events for subscription lifecycle.

**Events handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
