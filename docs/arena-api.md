# Arena API

> **Source:** `views/arena/`  
> **Modules:** `actions.mjs`, `collections/index.mjs`, `collections/benefits/`, `courses/index.mjs`, `gallery/index.mjs`, `leaderboard/index.mjs`, `inbox/inboxActions.mjs`, `posts/postActions.mjs`, `calls.mjs`

## Overview

The Arena API provides endpoints for social interactions (comments, likes), collection browsing, collection benefit management (albums, videos, gallery, files), course management, gallery/album management, leaderboard functionality, inbox messaging, and post management.

---

## Actions API

> **Source:** `views/arena/actions.mjs`  
> **Base URL:** `/v1/arena/action`

### Create Comment

```
POST /v1/arena/action/comment
```

Adds a comment to a collection. Requires authentication. Triggers email notification to the collection artist.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `comment` | `string` | Yes | Comment text |
| `collection` | `string` | Yes | Collection ID |

**Validation:** Uses `commentSchema` (Joi)

---

### Delete Comment

```
POST /v1/arena/action/comment/delete
```

Deletes a comment. Requires authentication and ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `commentId` | `string` | Yes | Comment ID |

---

### Like / Unlike

```
POST /v1/arena/action/like
```

Toggles a like on a collection. Creates or removes a like entry. Triggers email notification.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `collection` | `string` | Yes | Collection ID |

**Validation:** Uses `likeSchema` (Joi)

---

### Follow / Unfollow Creator

```
POST /v1/arena/action/follow
```

Toggles following a creator. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `followerId` | `string` | Yes | Creator user ID to follow |

---

### Check Follow Status

```
POST /v1/arena/action/follow/check
```

Checks if the current user follows a creator.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `followerId` | `string` | Yes | Creator user ID |

**Response:** `true` or `false`

---

## Arena Collections API

> **Source:** `views/arena/collections/index.mjs`  
> **Base URL:** `/v1/arena/collections`

### Fetch Collections

```
GET /v1/arena/collections/:page/:limit
```

Fetches paginated list of published collections from the marketplace.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `host` | `string` | Optional hostname to filter for whitelabel domains |

**Response:** Paginated collection list with artist info, banner, and pricing details.

---

### Fetch Collection by Slug

```
GET /v1/arena/collections/:slug
```

Fetches a specific collection by its project slug.

**Response:** Full collection details including launchpad type, launch info, benefits, FAQs, gallery.

---

### Fetch Creator Collections

```
GET /v1/arena/collections/creator/:id/:page/:limit
```

Fetches paginated collections for a specific creator.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Creator user ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Fetch Collection Comments

```
GET /v1/arena/collections/:id/comments/:page/:limit
```

Fetches paginated comments for a collection.

---

### Check Collection Like / Claim Status

```
POST /v1/arena/collections/:slug/check
```

Checks if user has liked or claimed a collection. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

---

## Courses API

> **Source:** `views/arena/courses/index.mjs`  
> **Base URL:** `/v1/courses`

### Fetch Creator Courses

```
GET /v1/courses/creator/:id
```

Fetches courses created by a specific creator. Results are cached.

---

### Fetch Single Course

```
GET /v1/courses/:id
```

Fetches a course by ID with full details: modules, lessons, and content.

---

### Fetch Course Module

```
GET /v1/courses/module/:id
```

Fetches a specific course module by ID.

---

## Gallery / Albums API

> **Source:** `views/arena/gallery/index.mjs`  
> **Base URL:** `/v1/albums`

### Fetch Creator Albums

```
GET /v1/albums/creator/:id
```

Fetches albums for a creator. Results are cached.

---

### Fetch Single Album

```
GET /v1/albums/:id
```

Fetches an album with its gallery items.

---

### Create Album

```
POST /v1/albums/create
```

Creates a new album with images. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | Album name |
| `fields.collection_id` | `string` | Yes | Collection to attach to |
| `files.images` | `File[]` | Yes | Gallery images |

---

### Update Album

```
POST /v1/albums/update/:id
```

Updates album name or adds new images. Requires authentication and ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | No | Updated album name |
| `files.images` | `File[]` | No | New images to add |

---

### Delete Album

```
POST /v1/albums/delete/:id
```

Deletes an album. Requires authentication and ownership.

---

### Delete Gallery Item

```
POST /v1/albums/delete/item/:id
```

Deletes a single item from a gallery. Requires authentication.

---

### Rename File

```
POST /v1/albums/rename
```

Renames a file in the gallery. Requires authentication and ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `file_id` | `string` | Yes | File ID |
| `file_name` | `string` | Yes | New file name |

---

## Leaderboard API

> **Source:** `views/arena/leaderboard/index.mjs`  
> **Base URL:** `/v1/arena/leaderboard`

### Get Leaderboard

```
GET /v1/arena/leaderboard/:genre/:division/:page/:limit
```

Fetches a paginated leaderboard filtered by genre and division.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `genre` | `string` | Genre ID |
| `division` | `string` | Division ID |
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |

---

### Get Full Leaderboard

```
GET /v1/arena/leaderboard/:genre/:division
```

Fetches the full leaderboard for a genre/division combination.

---

### Get Leaderboard by Grid

```
GET /v1/arena/leaderboard/grid/:page/:limit
```

Fetches all leaderboard entries in a grid format.

---

### Get Creator Rankings

```
GET /v1/arena/leaderboard/ranking/:id
```

Fetches leaderboard rankings for a specific creator.

---

### Get Vote Stats

```
POST /v1/arena/leaderboard/vote-stats
```

Fetches vote statistics. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

---

## Benefits API

> **Source:** `views/arena/collections/benefits/`  
> **Modules:** `album.mjs`, `video.mjs`, `gallery.mjs`, `files.mjs`, `deleteBenefit.mjs`

Manages content benefits attached to collections — albums (music tracks), videos, gallery images, and downloadable files.

### Create/Update Benefit Album

```
POST /v1/benefit/album
```

Creates or updates a music album benefit for a collection. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `fields.type` | `string` | Yes | `create` or `update` |
| `fields.query` | `string` | No | GraphQL mutation fields (e.g., album name, genre) |
| `fields.album_id` | `string` | Conditional | Required for `update` type |
| `files.file` | `File[]` | No | Audio track files |

**Response:** Album object with tracks list.

---

### Delete Album Tracks

```
POST /v1/benefit/album/:id
```

Deletes specific tracks from an album benefit. Requires authentication and collection ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Album ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `collection_id` | `string` | Yes | Collection ID |
| `ids` | `string[]` | Yes | Array of file IDs to delete |

---

### Create/Update Benefit Video

```
POST /v1/benefit/video
```

Creates or updates a video benefit for a collection. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `fields.type` | `string` | Yes | `create` or `update` |
| `fields.name` | `string` | Yes | Video name |
| `fields.video_id` | `string` | Conditional | Required for `update` type |
| `files.main_video` | `File` | No | Main video file |
| `files.preview_video` | `File` | No | Preview/trailer video |
| `files.thumbnail` | `File` | No | Thumbnail image |

**Response:** Video object with main video, preview, and thumbnail.

---

### Create/Update Benefit Gallery

```
POST /v1/benefit/gallery
```

Creates or updates a gallery (image collection) benefit. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `fields.type` | `string` | Yes | `create` or `update` |
| `fields.name` | `string` | Yes (create) | Gallery name |
| `fields.gallery_id` | `string` | Conditional | Required for `update` type |
| `fields.query` | `string` | No | GraphQL mutation fields |
| `files.file` | `File[]` | No | Gallery image files |

**Response:** Gallery object with gallery items.

---

### Delete Gallery Items

```
POST /v1/benefit/gallery/:id
```

Deletes specific items from a gallery benefit. Requires authentication and collection ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Gallery ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `collection_id` | `string` | Yes | Collection ID |
| `ids` | `string[]` | Yes | Array of file IDs to delete |

---

### Create/Update Benefit Files

```
POST /v1/benefit/files
```

Creates or updates a downloadable files benefit. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `fields.type` | `string` | Yes | `create` or `update` |
| `fields.name` | `string` | Yes | File group name |
| `fields.files_id` | `string` | Conditional | Required for `update` type |
| `files.file` | `File[]` | No | Files to upload |

**Response:** Files object with attached file list.

---

### Delete Benefit

```
POST /v1/benefit/delete
```

Deletes a benefit (album, video, gallery, or files) from a collection. Requires authentication and collection ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `benefit_type` | `string` | Yes | Type: `album`, `video`, `gallery`, `files` |
| `benefit_id` | `string` | Yes | Benefit ID to delete |

**Notes:**
- Dynamically resolves collection name: `collection_{benefit_type}` (except `gallery` which is used directly)
- Verifies ownership before deletion

---

## Inbox API

> **Source:** `views/arena/inbox/inboxActions.mjs`  
> **Base URL:** `/v1/arena/inbox`

Manages private messaging between users.

### Create Inbox Conversation

```
POST /v1/arena/inbox/createInbox
```

Creates a new inbox conversation with an initial message. Requires authentication. Sends email notification to the receiver.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `receiver_id` | `string` | Yes | Receiver user ID |
| `title` | `string` | Yes | Conversation title |
| `message` | `string` | Yes | Initial message content |

**Side Effects:**
- Sends Brevo transactional email (template 40)
- Sends Mixpanel event

**Response:** Created inbox object with sender info and message.

---

### Get Inbox List

```
GET /v1/arena/inbox/list
```

Fetches all inbox conversations for the authenticated user (both sent and received). Requires authentication.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response:** Array of inbox conversations sorted by last message date, each containing sender/receiver info and message count.

---

### Create Inbox Message

```
POST /v1/arena/inbox/createMessage
```

Sends a new message in an existing inbox conversation. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `inbox_id` | `string` | Yes | Inbox conversation ID |
| `message` | `string` | Yes | Message content |

**Side Effects:** Sends Mixpanel event.

**Response:** Created message object with creator info.

---

### Get Inbox Messages

```
GET /v1/arena/inbox/messages
```

Fetches all messages in an inbox conversation. Requires authentication and membership in the conversation (sender or receiver).

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |
| `inbox_id` | `string` | Yes | Inbox conversation ID |

**Response:**
```json
{
  "inboxInfo": [{ "title": "string", "sender": {}, "receiver": {} }],
  "messages": [
    { "creator": { "id": "string", "display_name": "string" }, "date_created": "string", "message": "string" }
  ]
}
```

---

## Posts API

> **Source:** `views/arena/posts/postActions.mjs`  
> **Base URL:** `/v1/arena/post`

Manages fan posts (editing and deleting).

### Edit Post

```
PATCH /v1/arena/post/:id
```

Edits the content of a post. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Post ID |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `content` | `string` | Yes | Updated post content |

---

### Delete Post

```
DELETE /v1/arena/post/:id
```

Deletes a post. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Post ID |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

---

## Helper Calls

> **Source:** `views/arena/calls.mjs`

Internal helper functions used by other arena modules. Not directly exposed as API routes.

| Function | Description |
|----------|-------------|
| `fetchUserNFTs({ address })` | Fetches NFTs owned by a wallet address |
| `fetchCollectionAddresses()` | Fetches all gated-content collection addresses |
| `fetchLikedData({ userId, postIds })` | Fetches like status for posts by a user |
| `handleLike({ create, id, userId })` | Creates or removes a post like |
