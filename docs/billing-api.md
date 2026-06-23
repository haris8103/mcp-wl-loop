# Billing API

> **Source:** `views/billing/`  
> **Modules:** `index.mjs`, `webhook.mjs`, `user/user_billing.mjs`  
> **Base URLs:** `/v1`, `/v1/billing/webhook`, `/v1/user/billing`

## Overview

The Billing API manages subscription plans including creation, upgrading, downgrading, and retrieval of user plans. It integrates with Stripe for payment processing and Stripe Checkout for subscription flows, utilizing webhooks to sync states back to Directus.

---

## Endpoints

### Get All Tiers & Subscriptions

```http
GET /v1/tiers-n-subscriptions
```

Fetches all available subscription tiers and their corresponding active plans.

**Response:**
```json
{
  "subscriptionPlans": {
    "subscription_tiers": [
      {
        "id": "uuid",
        "name": "string",
        "subscription_plans": [
          {
            "id": "uuid",
            "name": "string",
            "features": ["string"],
            "description": "string",
            "price_cents": 1000,
            "billing_interval": "monthly"
          }
        ]
      }
    ]
  }
}
```

---

### Get User Current Plan

```http
GET /v1/user/billing/plan
```

Fetches the currently authenticated user's active or trialing subscription plan.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response (200 OK):**
```json
{
  "id": "sub_123",
  "date_created": "2023-01-01T00:00:00Z",
  "date_updated": "2023-01-01T00:00:00Z",
  "user": "user_uuid",
  "tier": "tier_uuid",
  "provider_customer_id": "cus_123",
  "provider_subscription_id": "sub_123",
  "status": "active",
  "current_period_start": "2023-01-01T00:00:00Z",
  "current_period_end": "2023-02-01T00:00:00Z",
  "cancel_at_period_end": false,
  "canceled_at": null,
  "trial_start": null,
  "trial_end": null,
  "provider": "stripe",
  "plan": {
    "id": "1",
    "name": "Pro Plan"
  }
}
```

**Frontend contract:** `Fans_Studio/src/app/api/billing.api.tsx` consumes this value as `UserSubscription` directly from `response.data`, not under an outer wrapper.

---

### Upgrade/Start Subscription

```http
POST /v1/user/billing/upgrade
```

Initiates a Stripe Checkout session to upgrade or start a new subscription plan.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Request Body:**
```json
{
  "planId": "string"
}
```

**Logic:**
- Prevents upgrading to specific plans based on onboarding status.
- Automatically handles downgrading to the free plan (ID: "3") without Stripe checkout if requested.
- Creates or retrieves the associated Stripe Customer.
- Generates a Stripe Checkout Session ID and Redirect URL.

**Response (200 OK):**
```json
{
  "sessionId": "cs_test_...",
  "redirectUrl": "https://checkout.stripe.com/..."
}
```

---

### Upgrade Success Callback

```http
GET /v1/user/billing/success?session_id=<id>
```

Validates the successful completion of a Stripe Checkout session.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | `string` | Yes | The Checkout Session ID from Stripe |

**Response (200 OK):**
```json
{
  "message": "Payment successful",
  "session_id": "cs_test_123"
}
```

---

### Upgrade Cancel Callback

```http
GET /v1/user/billing/cancel
```

Callback endpoint if a user cancels the Stripe Checkout flow.

**Response (200 OK):**
```json
{
  "message": "Payment cancelled",
  "redirect_url": "https://frontend.url"
}
```

---

### Get Subscription Details

```http
GET /v1/user/billing/subscription/details
```

Fetches deep details of the user's active subscription directly from Stripe in combination with Directus data.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response (200 OK):**
```json
{
  "id": "sub_123",
  "stripe_details": {
    "status": "active",
    "items": [],
    "current_period_start": 1234567890,
    "current_period_end": 1234567890
  }
}
```

---

### Get Available Plans (User Specific)

```http
GET /v1/user/billing/plans
```

Fetches all subscription tiers and plans including provider price configurations (e.g., Stripe Price IDs).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Pro Tier"
  }
]
```

---

### Stripe Webhook

```http
POST /v1/billing/webhook
```

Handles asynchronous Stripe events to keep the database synchronized with Stripe's state.

**Events Handled:**
- `checkout.session.completed`: Creates the subscription and associates the customer.
- `customer.subscription.created`: Syncs a newly created subscription.
- `customer.subscription.updated`: Syncs plan changes, pauses, and cancellations.
- `customer.subscription.deleted`: Marks the subscription as cancelled.
- `invoice.payment_succeeded`: Updates period start/end times upon successful renewal.
- `invoice.payment_failed`: Handles failed payments (past due states).

**Logic:**
- Automatically links Stripe customers to Directus `billing_customers`.
- Logs subscription state transitions in `subscription_status_history`.
- Fires Posthog tracking events (`artist_subscription_started`, `artist_subscription_cancelled`, `artist_subscription_payment_failed`).
