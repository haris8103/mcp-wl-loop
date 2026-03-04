# Fans API

> **Source:** `views/fans/index.mjs`  
> **Base URL:** `/v1/fans`

## Overview

The Fans API manages fan-related operations — fetching fan profiles, managing followers, and retrieving fan data associated with collections and artists.

---

## Endpoints

### Get Fan Profile

```
GET /v1/fans/:id
```

Fetches a fan's public profile by user ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | User ID |

**Response:**
```json
{
  "id": "string",
  "first_name": "string",
  "display_name": "string",
  "username": "string",
  "avatar": { "id": "string" },
  "bio": "string"
}
```

---

### Get Fan's Followed Artists

```
GET /v1/fans/following/:id/:page/:limit
```

Fetches a list of artists/creators a fan is following, with pagination.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Fan user ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Get Fan's Collected NFTs

```
GET /v1/fans/collected/:id/:page/:limit
```

Fetches NFTs owned by a fan, with pagination.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Fan user ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Get Fans for a Collection

```
GET /v1/fans/collection/:id/:page/:limit
```

Fetches fans who hold NFTs from a specific collection.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Collection ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Get Artist's Followers

```
GET /v1/fans/followers/:id/:page/:limit
```

Fetches followers for a specific artist/creator.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Artist user ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Get Fan Activity

```
GET /v1/fans/activity/:id
```

Fetches recent activity for a fan (claims, follows, etc.).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Fan user ID |

---

### Check Fan Ownership

```
POST /v1/fans/check-ownership
```

Checks if a fan owns an NFT from a specific collection.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `collection_id` | `string` | Yes | Collection to check |

**Response:** `true` or `false`