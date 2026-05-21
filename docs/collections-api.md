# Collections API

> **Source:** `views/collections/index.mjs`  
> **Base URL:** `/v1`

## Overview

The Collections API manages fetching NFT collections, querying their statistics, checking launchpad expirations, and retrieving collections specific to a creator. It utilizes Directus via GraphQL and includes caching to optimize frequent lookups.

---

## Endpoints

### Check Launchpad Expiration

```http
GET /v1/collection/launchpad_exp/:platform/:address
```

Fetches the expiration/end date and time for a specific launchpad associated with an NFT address.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `platform` | `string` | The platform type (`fans` or other) |
| `address` | `string` | The NFT contract address |

**Response (200 OK):**
```json
{
  "endDate": "2026-12-31",
  "endTime": "23:59:59"
}
```

---

### Get Collection By URL

```http
GET /v1/collectionByUrl/:address
```

Fetches basic collection information (such as the contract address) using the collection's URL slug. This endpoint utilizes caching.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `address` | `string` | The URL slug of the collection |

**Response (200 OK):**
```json
{
  "address": "0x123abc..."
}
```

---

### Get Collections (Filtered & Sorted)

```http
POST /v1/collections
```

Fetches a list of NFT collections based on various filters and sorting parameters. This endpoint creates a hash of the request body to cache the result.

**Request Body:**
```json
{
  "sortType": "date_created",
  "sortOrder": "Desc",
  "nftType": "Reward",
  "rewardToken": "LOOP",
  "platform": "fans"
}
```

**Response (200 OK):**
```json
[
  {
    "name": "Collection Name",
    "description": "Collection Description",
    "icon": { "id": "uuid" },
    "banner": { "id": "uuid" },
    "url": "collection-url",
    "address": "0x123...",
    "rewardTokens": "LOOP",
    "itemCount": 100,
    "ownerCount": 50,
    "floorPrice": 10.5,
    "volumn": 1000.0,
    "totalItems": 100
  }
]
```

---

### Get Collection Details By URL

```http
GET /v1/collection/:id
```

Fetches comprehensive details for a specific collection by its URL slug. This endpoint uses caching.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The URL slug of the collection |

**Response (200 OK):**
```json
{
  "id": "uuid",
  "name": "Collection Name",
  "artist": {
    "avatar": { "id": "uuid" },
    "first_name": "First Name",
    "username": "username",
    "description": "Bio"
  },
  "icon": { "id": "uuid" },
  "banner": { "id": "uuid" },
  "description": "Description",
  "url": "collection-url",
  "address": "0x123...",
  "floorPrice": 10.5,
  "itemCount": 100,
  "ownerCount": 50,
  "volumn": 1000.0,
  "daily_volume": 10.0,
  "totalItems": 100,
  "socials": {
    "twitter": "string",
    "instagram": "string",
    "website": "string"
  },
  "faqs": { "Questions": [] }
}
```

---

### Get Creator Collections

```http
GET /v1/collections/creator/:username
```

Fetches a list of collections created by a specific artist/creator. This endpoint uses caching.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | `string` | The username of the artist |

**Response (200 OK):**
```json
[
  {
    "name": "Collection Name",
    "url": "collection-url",
    "banner": { "id": "uuid" },
    "totalItems": 100
  }
]
```