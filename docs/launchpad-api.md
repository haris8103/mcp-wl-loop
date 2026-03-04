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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection` | `string` (JSON) | Yes | Collection data (JSON string) |
| `files.artwork` | `File` | No | Collection artwork image |

**Collection JSON fields:**
| Field | Type | Description |
|-------|------|-------------|
| `collection_name` | `string` | Name of the collection |
| `status` | `string` | Publication status (`published`, `draft`) |
| `collection_description` | `string` | Description |
| `collection_quantity` | `number` | Max supply |
| `collection_price` | `string` | Mint price |
| `collection_min_price` | `string` | Minimum price |
| `collection_start_date` | `string` | Start date |
| `collection_start_time` | `string` | Start time |
| `collection_end_date` | `string` | End date |
| `collection_end_time` | `string` | End time |
| `collection_type` | `string` | Type (`collectible`, `vote`, `support`) |
| `chain` | `string` | Blockchain (`starknet` or other) |

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.status` | `string` | Yes | New status |

---

### Create Vote Collection (WMA)

```
POST /v1/launchpad/createVoteCollection
```

Creates a vote-type launchpad for World Music Awards competitions. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.divisionId` | `string` | Yes | Division ID |
| `fields.genreId` | `string` | Yes | Genre ID |
| `fields.status` | `string` | No | Status (default: `draft`) |
| `files.image` | `File` | Yes | Artwork image |
| `files.song` | `File` | Yes | Competition song |

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
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.launchpadId` | `string` | Yes | Launchpad ID |
| `fields.divisionId` | `string` | Yes | Division ID |
| `fields.genreId` | `string` | Yes | Genre ID |
| `fields.status` | `string` | Yes | Status |
| `files.image` | `File` | No | Updated artwork |
| `files.song` | `File` | No | Updated song |

---

### Create Support Collection

```
POST /v1/launchpad/createSupportCollection
```

Creates a support-type collection ("Good Vibes"). Requires authentication. Each user can only have one support collection.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `files.nft_image_1` | `File` | Yes | Primary NFT image |
| `files.nft_image_2` | `File` | No | Secondary NFT image |
| `files.nft_image_3` | `File` | No | Tertiary NFT image |

**Validation:** Uses `supportCollectionSchema` (Joi)
