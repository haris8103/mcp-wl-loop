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
```json
{
  "type": "string",
  "query": {
    "filter": "{}",
    "limit": 10,
    "page": 1
  },
  "cookie": "string",
  "form": {
    "name": "string",
    "description": "string",
    "image": "file_binary"
  },
  "query.collection_addr": "string",
  "query.starknet_address": "string"
}
```

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

### Claim NFT

```http
POST /v1/minter/claimNft
```

Claims an NFT (e.g., from an event or giveaway). Requires authentication.

**Request Body:**
```json
{
  "code": "string",
  "query": {
    "address": "string",
    "id": 1
  }
}
```

---

### Get Redeemables

```http
GET /v1/minter/redeemables/:nft_id
```

Fetches redeemable items associated with a specific NFT.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `nft_id` | `string` | ID of the NFT |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `address` | `string` | Yes | Wallet address of the owner |

---

### Redeem NFT

```http
POST /v1/minter/redeem
```

Redeems a redeemable NFT (physical/digital goods). Requires authentication and ownership of the NFT.

**Request Body:**
```json
{
  "access_token": "string",
  "qr_hash": "string",
  "collection_addr": "string",
  "starknet_address": "string"
}
```