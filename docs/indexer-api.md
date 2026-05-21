# Indexer API

> **Source:** `views/indexer/`  
> **Modules:** `index.mjs`  
> **Base URL:** `/v1/indexer`

## Overview

The Indexer API fetches on-chain and off-chain data regarding NFTs, their owners, collections, and associated events (transactions/transfers). It interacts with the Loop backend GraphQL and external indexing services.

---

## Endpoints

### Get NFTs by Owner

```http
GET /v1/indexer/nfts/owner/:address/:page/:limit
```

Fetches the NFTs owned by a specific wallet address or a comma-separated list of addresses.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | Wallet address or comma-separated addresses |
| `page` | `number` | Page number for pagination |
| `limit` | `number` | Number of items per page |

**Response (200 OK):**
```json
{
  "nfts": [
    {
      "id": "string",
      "owner": "string",
      "name": "string",
      "description": "string",
      "image": "string",
      "collection": {
        "id": "string",
        "name": "string",
        "address": "string"
      }
    }
  ],
  "pagination": {
    "total_pages": 1,
    "current_page": "1"
  }
}
```

---

### Get NFTs by Owner ID (Authenticated)

```http
POST /v1/indexer/nfts/owner_id/:page/:limit
```

Fetches the NFTs owned by the authenticated user's ID. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number for pagination |
| `limit` | `number` | Number of items per page |

**Request Body:**
```json
{
  "user_cookie": "string"
}
```

**Response (200 OK):**
```json
{
  "nfts": [
    {
      "id": "string",
      "owner": "string",
      "name": "string",
      "description": "string",
      "image": "string",
      "collection": {
        "id": "string",
        "name": "string",
        "address": "string"
      }
    }
  ],
  "pagination": {
    "total_pages": 1,
    "current_page": "1"
  }
}
```

---

### Get NFT Details (External Indexer)

```http
GET /v1/indexer/nft/:address/:limit
```

Fetches raw NFT details from the external blockchain indexer service.

---

### Get NFT Details (Directus)

```http
GET /v1/indexer/nftDetail/:id
```

Fetches comprehensive details for a specific NFT from the Directus backend, including its collection, associated media (album/video/files), and gallery information.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The UUID of the NFT |

---

### Get NFTs by Collection

```http
GET /v1/indexer/nfts/collection/:contract/:page/:limit
```

Fetches all NFTs associated with a specific smart contract collection address from the external indexer.

---

### Get Collection Details

```http
GET /v1/indexer/collection/:contract
```

Fetches details about a specific smart contract collection from the external indexer.

---

### Get NFT Events

```http
GET /v1/indexer/events/nft/:address/:limit
```

Fetches transaction/transfer events for a specific NFT address.

---

### Get User Events

```http
GET /v1/indexer/events/user/:address
```

Fetches transaction events for a specific user wallet address.

---

### Get Number of NFTs by Artist

```http
GET /v1/indexer/nfts/artist/:artistId
```

Fetches the count of NFTs owned by a specific user (or list of wallets) that belong to a given artist.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `artistId` | `string` | The artist's user UUID or username |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `walletAddrs` | `string` | Yes | Comma-separated list of wallet addresses to check |

**Response (200 OK):**
```json
[
  {
    "user": "0x123abc",
    "nfts": 5
  }
]
```
