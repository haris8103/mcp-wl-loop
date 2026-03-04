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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | `string` | Yes | Creator user ID |
| `page` | `number` | No | Page number (default: 1) |
| `limit` | `number` | No | Items per page (default: 10) |

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.content` | `string` | Yes | Post content |
| `files.images` | `File[]` | No | Image attachments |

**Response:** Created post object

---

### Delete Feed Post

```
POST /v1/arena/feed/delete
```

Deletes a feed post. Requires authentication and ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `postId` | `string` | Yes | Post ID to delete |

---

### Get Feed Comments

```
POST /v1/arena/feed/comments
```

Fetches comments for a feed post.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `postId` | `string` | Yes | Feed post ID |
| `page` | `number` | No | Page number |
| `limit` | `number` | No | Items per page |

---

### Create Feed Comment

```
POST /v1/arena/feed/comment
```

Creates a comment on a feed post. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `postId` | `string` | Yes | Feed post ID |
| `comment` | `string` | Yes | Comment text |

---

### Like/Unlike Feed Post

```
POST /v1/arena/feed/like
```

Toggles a like on a feed post. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `postId` | `string` | Yes | Feed post ID |

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

**Response:** Array of launchpad objects with project name, slug, status, and banner.

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `divisionId` | `string` | Yes | Division ID |
| `genreId` | `string` | Yes | Genre ID |

**Response:** `true` or `false`

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | Yes | Username to check (5-30 chars) |

**Response:**
- `200` — Username is available
- `400` — Username is taken or invalid
