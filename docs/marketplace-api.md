# Marketplace API

> **Source:** `views/index.mjs`  
> **Base URL:** `/v1`

## Overview

The Marketplace API provides endpoints for browsing public content on the Loop platform, including creator profiles, feeds, collections, launchpads, and search functionality.

---

## Endpoints

### Get Creator Profile

```
GET /v1/arena/:username
```

Fetches a public creator profile by username or user ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | `string` | Creator username or UUID |

**Response:**
```json
{
  "creator": {
    "id": "string",
    "first_name": "string",
    "username": "string",
    "display_name": "string",
    "avatar": { "id": "string" },
    "bio": "string",
    "social_links": "string",
    "cover": { "id": "string" },
    "banner": { "id": "string" }
  },
  "domain": {
    "domain": "string"
  }
}
```

**Notes:**
- Detects whether the input is a UUID or username
- Results are cached

---

### Get Creator Feed

```
POST /v1/arena/feed
```

Fetches the feed for a creator, including posts, launchpad data, events, and albums.

**Request Body:**
```json
{
  "user": "string",
  "page": 0,
  "limit": 0
}
```

**Response:**
```json
{
  "feed": [
    {
      "id": "string",
      "content": "string",
      "user_created": { "id": "string", "username": "string" },
      "date_created": "string",
      "images": [],
      "comments_count": 0,
      "likes_count": 0
    }
  ]
}
```

---

### Create Feed Post

```
POST /v1/arena/feed/create
```

Creates a new feed post with optional image uploads. Requires authentication.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.content": "string",
  "files.images": []
}
```

**Response:**
```json
{
  "id": "uuid",
  "content": "string",
  "date_created": "2023-01-01T00:00:00Z"
}
```

---

### Delete Feed Post

```
POST /v1/arena/feed/delete
```

Deletes a feed post. Requires authentication and ownership.

**Request Body:**
```json
{
  "cookie": "string",
  "postId": "string"
}
```

---

### Get Feed Comments

```
POST /v1/arena/feed/comments
```

Fetches comments for a feed post.

**Request Body:**
```json
{
  "postId": "string",
  "page": 0,
  "limit": 0
}
```

---

### Create Feed Comment

```
POST /v1/arena/feed/comment
```

Creates a comment on a feed post. Requires authentication.

**Request Body:**
```json
{
  "cookie": "string",
  "postId": "string",
  "comment": "string"
}
```

---

### Like/Unlike Feed Post

```
POST /v1/arena/feed/like
```

Toggles a like on a feed post. Requires authentication.

**Request Body:**
```json
{
  "cookie": "string",
  "postId": "string"
}
```

---

### Get Creator Collection / Launchpad

```
GET /v1/arena/collection/:slug
```

Fetches a specific launchpad/collection by slug.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | `string` | Project slug |

---

### Get Featured Launchpads

```
GET /v1/arena/launchpads
```

Fetches all published, non-completed launchpads sorted by status and date.

**Response:**
```json
[
  {
    "project_name": "string",
    "slug": "string",
    "status": "live",
    "banner": "uuid"
  }
]
```

---

### Get Genres

```
GET /v1/arena/genres
```

Fetches all available genres.

---

### Get Divisions

```
GET /v1/arena/divisions
```

Fetches all available divisions.

---

### Check Leaderboard Membership

```
POST /v1/arena/checkLeaderboard
```

Checks if the authenticated user is in a specific leaderboard.

**Request Body:**
```json
{
  "cookie": "string",
  "divisionId": "string",
  "genreId": "string"
}
```

**Response:**
```json
true
```

---

### Get Latest Launchpad for Creator

```
GET /v1/arena/launchpad/latest/:user
```

Fetches the latest ongoing launchpad for a specific creator.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `string` | Creator user ID |

---

### Get Creator Events

```
POST /v1/arena/events/:id
```

Fetches published events for a creator.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Creator user ID |

---

### Change User Role to Artist

```
POST /v1/arena/changeUserRole
```

Upgrades a user's role to artist. Requires authentication.

**Request Body:**
```json
{
  "cookie": "string"
}
```

**Side Effects:**
- Updates user role in Directus
- Updates Brevo contact with artist attributes
- Sends Mixpanel event

---

### Check Username Availability

```
POST /v1/arena/checkUsername
```

Checks if a username is available.

**Request Body:**
```json
{
  "username": "string"
}
```

**Response (200 OK):**
```json
{
  "message": "Username is available"
}
```
**Response (400 Bad Request):**
```json
{
  "error": "Username is taken or invalid"
}
```

---

## Actual Marketplace Endpoints

> **Source:** `views/index.mjs`
> **Base URL:** `/v1/marketplace`

### Get Favorite Items

```http
GET /v1/marketplace/favs/:platoform/:id
```

Fetches the favorite items (collections and launchpads) for a specific user ID/wallet address on a given platform.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `platoform` | `string` | Platform identifier |
| `id` | `string` | User ID or wallet address |

---

### Check if Item is Favorite

```http
GET /v1/marketplace/favs/:platform/:type/:id/:address
```

Checks whether a specific item (collection, cosmos_launchpad, fans_launchpad) is favorited by the user.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `platform` | `string` | Platform identifier |
| `type` | `string` | Type of item |
| `id` | `string` | Item ID |
| `address` | `string` | Wallet address |

---

### Check Transaction Status

```http
GET /v1/marketplace/transaction_status/:transaction_id
```

Retrieves the status and history details of a specific payment transaction.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `transaction_id` | `string` | ID of the transaction |

---

### Load Default Configurations

```http
POST /v1/marketplace/load_default
```

Fetches and synchronizes default content blocks and funnels for the artist's whitelabel domain. Handles background tasks like downloading/uploading default assets to the user's domain.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | User authentication cookie |
| `template` | `string` | Yes | Template name or ID |

