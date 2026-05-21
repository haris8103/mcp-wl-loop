# Launchpad API

> **Source:** `views/launchpad/`  
> **Modules:** `getCollection.mjs`, `createCollection.mjs`, `handleVoteCollection.mjs`  
> **Base URL:** `/v1/launchpad`

## Overview

The Launchpad API manages launchpad/collection creation and management — including standard collectible drops, vote collections (WMA), and support collections. Handles image/song uploads, plan limits, and integrates with Mixpanel, Brevo, and PostHog.

---

## Endpoints

### Get Launchpad by Slug

```
GET /v1/launchpad/:id
```

Fetches a launchpad by its project slug with launch info (dates, pricing).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Project slug |

**Response:**
```json
{
  "project_name": "string",
  "project_slug": "string",
  "banner": { "id": "string" },
  "launchInfo": {
    "startDate": "string",
    "startTime": "string",
    "endDate": "string",
    "endTime": "string",
    "publicDate": "string",
    "publicTime": "string",
    "minPrice": "string"
  }
}
```

---

### Create Collection (Launchpad)

```
POST /v1/launchpad/createCollection
```

Creates a new launchpad with attached fan collection. Requires authentication. Subject to `mustBeAuthenticated` and `planLimitsMiddleware`.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.collection": "string",
  "files.artwork": "file_binary"
}
```

**Collection JSON fields:**
```json
{
  "collection_name": "string",
  "status": "string",
  "collection_description": "string",
  "collection_quantity": 1000,
  "collection_price": "string",
  "collection_min_price": "string",
  "collection_start_date": "string",
  "collection_start_time": "string",
  "collection_end_date": "string",
  "collection_end_time": "string",
  "collection_type": "string",
  "chain": "string"
}
```

**Side Effects:**
- Uploads artwork to cloud storage
- Creates launchpad and collection in Directus
- Tracks Mixpanel events
- Sends PostHog events (free vs paid drop)

---

### Edit Collection

```
POST /v1/launchpad/editCollection/:id
```

Updates an existing launchpad/collection. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Launchpad ID |

**Request Body (multipart/form-data):**
Same structure as Create Collection, with all fields optional for partial updates.

---

### Update Collection Status

```
POST /v1/launchpad/editCollection/update-status/:id
```

Updates just the status (published/draft) of a launchpad and its collection. Requires authentication and ownership.

**Request Body:**
```json
{
  "cookie": "string",
  "status": "string"
}
```

**Validation:** Uses `voteCollectionSchema` (Joi)

**Side Effects:**
- Creates launchpad with auto-generated name: "WMA Vote {genre} ({division}) - {username}"
- Adds user to the leaderboard
- Updates Brevo contact with division info
- Tracks Mixpanel event

---

### Edit Vote Collection

```
POST /v1/launchpad/editVoteCollection
```

Updates a vote collection (image, song, genre, division). Requires authentication and ownership.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.launchpadId": "string",
  "fields.divisionId": "string",
  "fields.genreId": "string",
  "fields.status": "string",
  "files.image": "file_binary",
  "files.song": "file_binary"
}
```

---

### Create Support Collection

```
POST /v1/launchpad/createSupportCollection
```

Creates a support-type collection ("Good Vibes"). Requires authentication. Each user can only have one support collection.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "files.nft_image_1": "file_binary",
  "files.nft_image_2": "file_binary",
  "files.nft_image_3": "file_binary"
}
```

**Validation:** Uses `supportCollectionSchema` (Joi)
