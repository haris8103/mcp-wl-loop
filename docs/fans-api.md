# Fans API

> **Source:** `views/fans/index.mjs`  
> **Base URL:** `/v1/fans`

## Overview

The Fans API manages fan-related operations — fetching fan profiles, managing followers, and retrieving fan data associated with collections and artists.

---

## Endpoints

### Get Fans Homepage

```http
GET /v1/fans/pages/fans_homepage
```

Fetches homepage data for the fans platform.

**Response:**
```json
{
  "group_type": "string",
  "headline": "string",
  "sub_title": "string",
  "content": "string",
  "cards": [
    {
      "title": "string",
      "sub_title": "string",
      "image": { "id": "file_uuid" },
      "link": "string"
    }
  ],
  "events": [
    {
      "title": "string",
      "content": "string",
      "featured_image": { "id": "file_uuid" },
      "video": "string"
    }
  ]
}
```

---

### Get Creators

```http
GET /v1/fans/creators
```

Fetches a list of creators on the platform.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `page` | `number` | Page number |
| `limit` | `number` | Item limit |
| `genre` | `string` | Genre ID to filter by |
| `searchterm` | `string` | Term to search in display name/username |
| `collab` | `boolean` | Filter by featured song availability |
| `query` | `string` | Additional query |

**Response:**
```json
[
  {
    "id": "uuid",
    "username": "string",
    "first_name": "string",
    "display_name": "string",
    "description": "string",
    "background": { "id": "uuid" },
    "avatar": { "id": "uuid" },
    "creator_type": "string",
    "create_date": "string",
    "featured_song": { "id": "uuid" }
  }
]
```

---

### Get Artist Profile

```http
GET /v1/fans/artist/:id
```

Fetches the profile details of an artist by their ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Artist User ID |

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "description": "string",
    "video_link": "string",
    "video_thumbnail": { "id": "uuid" },
    "avatar": { "id": "uuid" },
    "background": { "id": "uuid" },
    "socials": {
      "twitter": "string",
      "instagram": "string",
      "website": "string"
    },
    "stats": {
      "followers": 0,
      "likes": 0
    },
    "followers": 100,
    "likes": 50,
    "verified": true,
    "creator_type": "string",
    "cta_banner": { "id": "uuid" },
    "cta_link": "string",
    "event_background": { "id": "uuid" },
    "event_date": "string"
  },
  "followers": 100,
  "likes": 50
}
```

---

### Get Fan Collections

```http
GET /v1/fans/fans_collections
```

Fetches the collections associated with fans.

---

### Get Fan Collections by Username

```http
GET /v1/fans/fans_collections/:username
```

Fetches the collections associated with a specific fan username.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | `string` | Fan Username |

**Response:**
```json
[
  {
    "id": "uuid",
    "project_name": "string",
    "required_tags": ["string"],
    "project_slug": "string",
    "banner": { "id": "uuid" },
    "collection_type": "string",
    "launchpad_type": [
      {
        "launchInfo": {
          "startDate": "string",
          "startTime": "string"
        },
        "collections_type": {
          "name": "string",
          "desc": "string"
        },
        "collection": {
          "name": "string",
          "description": "string",
          "url": "string",
          "faqs": [{ "Questions": "string" }]
        },
        "benefits": [{ "benefit": "string" }]
      }
    ]
  }
]
```

---

### Get Featured Artist

```http
GET /v1/fans/featured_artist
```

Fetches the current featured artist.

---

### Get Fans Exclusive

```http
GET /v1/fans/fans_exclusive/:id
```

Fetches exclusive content for fans by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Content ID |

---

### Get Fans Launchpad

```http
GET /v1/fans/fans_launchpad/:id
```

Fetches the details of a fans launchpad by ID.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `user_cookie` | `string` | Optional authentication cookie |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Launchpad ID |

**Response:**
```json
[
  {
    "collection_id": "uuid",
    "name": "string",
    "address": "string",
    "artwork": { "id": "uuid" },
    "artist": { "profile_id": "uuid" },
    "maxSupply": 1000,
    "sold": 150,
    "profit": "500.00",
    "total": "550.00",
    "collection_type": "string"
  }
]
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Launchpad status filter |
| `isId` | `boolean` | Flag if searching by ID |

**Response:**
```json
{
  "info": {
    "id": "uuid",
    "project_name": "string",
    "project_slug": "string",
    "project_status": "string",
    "required_tags": ["string"],
    "status": "string",
    "went_live": "string",
    "mint_status": "string",
    "collection_type": "string",
    "featured": true,
    "artist": {
      "id": "uuid",
      "first_name": "string",
      "username": "string",
      "display_name": "string",
      "avatar": { "id": "uuid" }
    },
    "banner": { "id": "uuid" },
    "launchpad_type": []
  }
}
```

---

### Get Fans Launchpad Detail

```http
GET /v1/fans/fans_launchpad/detail/:id
```

Fetches deep details of a specific fans launchpad.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Launchpad ID |

**Response:**
```json
[
  {
    "collection_id": "uuid",
    "name": "string",
    "address": "string",
    "artwork": { "id": "uuid" },
    "artist": { "profile_id": "uuid" },
    "maxSupply": 1000,
    "sold": 150,
    "profit": "500.00",
    "total": "550.00",
    "collection_type": "string"
  }
]
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Launchpad status filter |
| `isId` | `boolean` | Flag if searching by ID |

**Response:**
```json
{
  "info": {
    "id": "uuid",
    "project_name": "string",
    "project_slug": "string",
    "project_status": "string",
    "required_tags": ["string"],
    "status": "string",
    "went_live": "string",
    "mint_status": "string",
    "collection_type": "string",
    "featured": true,
    "artist": {
      "id": "uuid",
      "first_name": "string",
      "username": "string",
      "display_name": "string",
      "avatar": { "id": "uuid" }
    },
    "banner": { "id": "uuid" },
    "launchpad_type": []
  }
}
```

---

### Get Fans Launchpad Insights

```http
GET /v1/fans/fans_launchpad/insights/:id
```

Fetches insight statistics (e.g., max supply, sold, total revenue) for a specific fans launchpad.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `user_cookie` | `string` | Required authentication cookie |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Launchpad ID |

**Response:**
```json
[
  {
    "collection_id": "uuid",
    "name": "string",
    "address": "string",
    "artwork": { "id": "uuid" },
    "artist": { "profile_id": "uuid" },
    "maxSupply": 1000,
    "sold": 150,
    "profit": "500.00",
    "total": "550.00",
    "collection_type": "string"
  }
]
```

---

### Get Fans Launchpad Transactions

```http
GET /v1/fans/fans_launchpad/insights/transactions/:id/:page
```

Fetches the latest transactions/orders for a fans launchpad.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `user_cookie` | `string` | Required authentication cookie |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Launchpad ID |

**Response:**
```json
[
  {
    "collection_id": "uuid",
    "name": "string",
    "address": "string",
    "artwork": { "id": "uuid" },
    "artist": { "profile_id": "uuid" },
    "maxSupply": 1000,
    "sold": 150,
    "profit": "500.00",
    "total": "550.00",
    "collection_type": "string"
  }
]
```
| `page` | `number` | Page number |

---

### Get Fans Launchpad Transactions By Collection

```http
POST /v1/fans/fans_launchpad/transactions/byCollection
```

Fetches the transaction history (orders) for collections, with filtering options.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `user_cookie` | `string` | Required authentication cookie |

**Request Body:**
```json
{
  "collection_id": "string",
  "page": 0,
  "fan": "string",
  "start_date": "string",
  "end_date": "string"
}
```

---

### Get Payment Transactions

```http
GET /v1/fans/payment_transactions/:page
```

Fetches payment history for a collection.

**Headers:**
| Header | Type | Description |
|--------|------|-------------|
| `user_cookie` | `string` | Required authentication cookie |

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number |

**Request Body:**
```json
{
  "collection_id": "string"
}
```

---

### Follow an Artist

```http
POST /v1/fans/following
```

Creates a follow relationship between a fan and an artist.

**Request Body:**
```json
{
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  }
}
```

---

### Customers / Manage Audience

```http
POST /v1/fans/customers
```

Manages customer records or audience data for fans/creators.

**Request Body:**
```json
{
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  },
  "collection_id": "string",
  "search": "string",
  "page": 0
}
```

---

### Get Collections (POST)

```http
POST /v1/fans/get/collections
```

Retrieves collections based on POST parameters.

**Request Body:**
```json
{
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  }
}
```

---

### Check NFT Owner

```http
POST /v1/fans/nft/owner
```

Checks or verifies the ownership of an NFT for a fan.

**Request Body:**
```json
{
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  },
  "collection_id": "string"
}
```

---

### Fans Launchpad Form Submissions

```http
POST /v1/fans_launchpad_submissions
```

> **Source:** `views/fans/fans_launchpad_form_submissions.mjs`

Submits a form for a fans launchpad.

**Request Body:**
```json
{
  "form": {
    "country": "pk",
    "birthday": "2000-01-01"
  },
  "query": {
    "collection_addr": "string"
  },
  "user_id": "string"
}
```

---

### Get Launchpad Form Submission Fans

```http
GET /v1/fans_launchpad_submissions/fans
```

> **Source:** `views/fans/fans_launchpad_form_submissions.mjs`

Fetches the fans who submitted forms for a launchpad.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | Launchpad ID |