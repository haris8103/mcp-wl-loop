# Minter API

> **Source:** `views/minter/index.mjs`  
> **Base URL:** `/v1/minter`

## Overview

The Minter API handles NFT minting, claiming, and redeeming operations. Supports both Cosmos (Loop) and StarkNet blockchains. Integrates with Mixpanel, PostHog for analytics, and Brevo for email notifications.

---

## Endpoints

### Mint NFT (Free Mint)

```
POST /v1/minter/mint
```

Mints a free NFT from a launchpad to a user's wallet. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `launchpadId` | `string` | Yes | Launchpad ID to mint from |

**Flow:**
1. Validates user authentication
2. Checks mint limits and availability
3. Determines blockchain (StarkNet or Cosmos)
4. Creates NFT record in Directus
5. Executes on-chain mint transaction
6. Tracks analytics events (Mixpanel, PostHog)
7. Sends email notification via Brevo

**StarkNet Minting:**
- Uses Paymaster for gasless transactions
- Calls contract's `mint` function with recipient address and token URI

**Cosmos Minting:**
- Uses admin seed wallet
- Executes `mint` message on CosmWasm contract

**Response:**
```json
{
  "success": true,
  "tx": "transaction_hash",
  "nft": {
    "id": "string",
    "token_id": "number",
    "name": "string",
    "collection": "string"
  }
}
```

---

### Mint NFT with Payment

```
POST /v1/minter/mint/pay
```

Mints an NFT after successful payment. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `launchpadId` | `string` | Yes | Launchpad ID |
| `paymentId` | `string` | Yes | Payment history record ID |

---

### Claim by Code

```
POST /v1/minter/claim
```

Claims an NFT using a claim code. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `claim_code` | `string` | Yes | Claim code |

**Flow:**
1. Validates claim code exists and is unused
2. Checks code hasn't expired
3. Mints NFT to user's wallet
4. Marks code as used
5. Tracks analytics

---

### Validate Claim Code

```
POST /v1/minter/claim/validate
```

Validates a claim code without using it.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `claim_code` | `string` | Yes | Claim code to validate |

**Response:**
```json
{
  "valid": true,
  "collection": {
    "name": "string",
    "description": "string"
  }
}
```

---

### Redeem NFT

```
POST /v1/minter/redeem
```

Redeems a redeemable NFT (physical/digital goods). Requires authentication and ownership of the NFT.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `nft_id` | `string` | Yes | NFT ID to redeem |
| `shipping_address` | `object` | No | Shipping address for physical goods |

---

### Get Mint Status

```
GET /v1/minter/status/:launchpadId
```

Gets the current mint status (supply, minted count, availability) for a launchpad.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `launchpadId` | `string` | Launchpad ID |

**Response:**
```json
{
  "total_supply": "number",
  "minted": "number",
  "available": "number",
  "is_active": "boolean"
}
```

---

### Check User Mint Eligibility

```
POST /v1/minter/check
```

Checks if a user has already minted from a launchpad, and how many mints they have left.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `launchpadId` | `string` | Yes | Launchpad ID |

**Response:**
```json
{
  "has_minted": "boolean",
  "mint_count": "number",
  "mint_limit": "number",
  "can_mint": "boolean"
}
```
