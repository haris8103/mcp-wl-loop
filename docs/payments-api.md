# Payments API

> **Source:** `views/payments/providers.mjs`  
> **Base URL:** `/v1/payment`

## Overview

The Payments API handles payment processing for NFT purchases, supporting Stripe and other payment providers. It manages payment intents, confirmations, and payment history records.

---

## Endpoints

### Generate Checkout URL

```http
POST /v1/payments/generate_checkout_url
```

Generates a Stripe checkout URL for an NFT or item purchase.

**Request Body:**
```json
{
  "wallet_addr": "string",
  "user": "string",
  "launchpad_id": "string",
  "collection_name": "string",
  "collection_addr": "string",
  "collection_desc": "string",
  "payment_amount": 0,
  "number_of_nfts": 0,
  "document_id": "string",
  "referral": "string",
  "provider": "string"
}
```

---

### Payment Events

```http
POST /v1/payments/events
```
```http
POST /v1/mint/payment/events
```

Handles custom payment events or state changes for a transaction.

**Request Body:**
```json
{
  "data": {
    "amount": 1000,
    "currency": "usd",
    "description": "Payment description",
    "source": "tok_visa"
  }
}
```

---

### Verify Payment

```http
POST /v1/payments/verify
```

Verifies the status of a payment transaction across various providers.

**Request Body:**
```json
{
  "data": {
    "amount": 1000,
    "currency": "usd",
    "description": "Payment description",
    "source": "tok_visa"
  }
}
```

---

### Stripe Verification

```http
POST /v1/payments/stripe/verify
```

Specifically verifies a Stripe payment status.

**Request Body:**
```json
{
  "data": {
    "amount": 1000,
    "currency": "usd",
    "description": "Payment description",
    "source": "tok_visa"
  }
}
```

---

### Stripe Webhook

```http
POST /v1/payments/webhook
```

Processes Stripe webhook events for payment lifecycle management (e.g. `checkout.session.completed`, `payment_intent.succeeded`).

**Request Body:**
```json
{
  "data": {
    "amount": 1000,
    "currency": "usd",
    "description": "Payment description",
    "source": "tok_visa"
  }
}
```

---

### Create Payment Intent

```http
POST /v1/payments/intent
```

Creates a Stripe payment intent for custom checkout flows.

**Request Body:**
```json
{
  "collection_id": "string",
  "quantity": 0,
  "wallet_address": "string",
  "user": "string",
  "minPrice": "string"
}
```

