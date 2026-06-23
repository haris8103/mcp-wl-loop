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

```http
POST /v1/arena/action/comment
```

Adds a comment to a post. Requires authentication. Triggers email notification to the post artist.

**Request Body:**
```json
{
  "cookie": "string",
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
  "comment": "string",
  "post_id": "string"
}
```

**Validation:** Uses `commentSchema` (Joi)

---

### Like / Unlike

```http
POST /v1/arena/action/like
```

Toggles a like on a post. Creates or removes a like entry. Triggers email notification.

**Request Body:**
```json
{
  "cookie": "string",
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
  "post_id": "string"
}
```


**Validation:** Uses `likeSchema` (Joi)

---

### Follow / Unfollow Creator

```
POST /v1/arena/action/follow
```

Toggles following a creator. Requires authentication.

**Request Body:**
```json
{
  "cookie": "string",
  "followerId": "string"
}
```

---

### Check Follow Status

```
POST /v1/arena/action/follow/check
```

Checks if the current user follows a creator.

**Request Body:**
```json
{
  "cookie": "string",
  "followerId": "string"
}
```

**Response:**
```json
true
```

---

## Arena Collections API

> **Source:** `views/arena/collections/index.mjs`  
> **Base URL:** `/v1/arena/collections`

### Fetch Collections

```
GET /v1/arena/collections
```

Fetches paginated list of published collections from the marketplace.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |
| `host` | `string` | Optional hostname to filter for whitelabel domains |

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "artist": {
        "id": "uuid",
        "display_name": "string",
        "avatar": { "id": "uuid" }
      },
      "banner": "uuid",
      "price": 100
    }
  ],
  "pagination": {
    "page": 1,
    "total": 10
  }
}
```

---

### Fetch Collection by Slug

```
GET /v1/arena/collections/:slug
```

Fetches a specific collection by its project slug.

**Response:**
```json
{
  "id": "uuid",
  "launchpad_type": "string",
  "launchInfo": {
    "startDate": "string",
    "endDate": "string",
    "mintPrice": "string",
    "minPrice": "string",
    "supply": "number"
  },
  "benefits": [],
  "faqs": [],
  "gallery": []
}
```

---

### Fetch Collections by Artist

```
GET /v1/arena/collections/byArtist/:id
```

Fetches collections for a specific artist.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Artist user ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Status filter |
| `type` | `string` | Type filter |
| `limit` | `number` | Items per page |
| `page` | `number` | Page number |
| `isFree` | `boolean` | Free collection flag |

---

### Fetch Collections by User ID

```
GET /v1/arena/collections/byId/:userId
```

Fetches collections for a specific creator/user by their ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | Creator User ID |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Status filter |
| `type` | `string` | Type filter |
| `limit` | `number` | Items per page |
| `page` | `number` | Page number |
| `isFree` | `boolean` | Free collection flag (0 or 1) |

---

### Fetch Artist NFTs

```
GET /v1/arena/collections/artist/nft/:id/:limit?/:page?
```

Fetches all NFTs owned by users that were minted from an artist's collections.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Artist user ID |
| `limit` | `number` | Optional. Items per page (default: 10) |
| `page` | `number` | Optional. Page number (default: 1) |

---

### Fetch Collection NFT Owners

```
GET /v1/arena/collections/nft_owners/:id
```

Fetches the owners of NFTs for a specific collection.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Collection ID |

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `collectionName` | `string` | Optional name of the collection |

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
POST /v1/albums/:id
```

Fetches an album with its gallery items.

**Request Body:**
```json
{
  "cookie": "string",
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

### Create Album

```
POST /v1/albums/create
```

Creates a new album with images. Requires authentication.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.name": "string",
  "fields.collection_id": "string",
  "files.images": []
}
```

---

### Update Album

```
POST /v1/albums/update/:id
```

Updates album name or adds new images. Requires authentication and ownership.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.name": "string",
  "files.images": []
}
```

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
```json
{
  "cookie": "string",
  "file_id": "string",
  "file_name": "string"
}
```

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
```json
{
  "cookie": "string"
}
```

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
```json
{
  "fields.cookie": "string",
  "fields.collection_id": "string",
  "fields.type": "string",
  "fields.query": "string",
  "fields.album_id": "string",
  "files.file": []
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie |
| `collection_id` | `string` | Yes | Fans collection ID |
| `type` | `string` | Yes | Operation type: `create` for a new album benefit, `update` for editing an existing album benefit |
| `query` | `string` | Yes | Album metadata query string, for example `name: "Album", genre: { id: 1 }` |
| `album_id` | `string` | Required for `update` | Existing album benefit ID |
| `file` | `File[]` | No | Audio tracks to upload or append |

**Response:**
```json
{
  "id": "uuid",
  "title": "Album Title",
  "tracks": []
}
```

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
```json
{
  "cookie": "string",
  "collection_id": "string",
  "ids": []
}
```

---

### Create/Update Benefit Video

```
POST /v1/benefit/video
```

Creates or updates a video benefit for a collection. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.collection_id": "string",
  "fields.type": "string",
  "fields.name": "string",
  "fields.video_id": "string",
  "files.main_video": "file_binary",
  "files.preview_video": "file_binary",
  "files.thumbnail": "file_binary"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie |
| `collection_id` | `string` | Yes | Fans collection ID |
| `type` | `string` | Yes | Operation type: `create` for a new video benefit, `update` for editing an existing video benefit |
| `name` | `string` | Yes | Video benefit name |
| `video_id` | `string` | Required for `update` | Existing video benefit ID |
| `main_video` | `File` | Required for `create` | Main video file |
| `preview_video` | `File` | No | Preview video file |
| `thumbnail` | `File` | No | Thumbnail image file |

**Response:**
```json
{
  "id": "uuid",
  "video_url": "url",
  "preview_url": "url",
  "thumbnail": "uuid"
}
```

---

### Create/Update Benefit Gallery

```
POST /v1/benefit/gallery
```

Creates or updates a gallery (image collection) benefit. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.collection_id": "string",
  "fields.type": "string",
  "fields.name": "string",
  "fields.gallery_id": "string",
  "fields.query": "string",
  "files.file": []
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie |
| `collection_id` | `string` | Yes | Fans collection ID |
| `type` | `string` | Yes | Operation type: `create` for a new gallery benefit, `update` for editing an existing gallery benefit |
| `name` | `string` | Yes | Gallery benefit name |
| `gallery_id` | `string` | Required for `update` | Existing gallery benefit ID |
| `query` | `string` | No | Optional gallery metadata query string |
| `file` | `File[]` | No | Gallery image files to upload or append |

**Response:**
```json
{
  "id": "uuid",
  "items": []
}
```

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
```json
{
  "cookie": "string",
  "collection_id": "string",
  "ids": []
}
```

---

### Create/Update Benefit Files

```
POST /v1/benefit/files
```

Creates or updates a downloadable files benefit. Requires authentication and collection ownership.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.collection_id": "string",
  "fields.type": "string",
  "fields.name": "string",
  "fields.files_id": "string",
  "files.file": []
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie |
| `collection_id` | `string` | Yes | Fans collection ID |
| `type` | `string` | Yes | Operation type: `create` for a new downloadable-file benefit, `update` for editing an existing file benefit |
| `name` | `string` | Yes | File benefit name |
| `files_id` | `string` | Required for `update` | Existing file benefit ID |
| `file` | `File[]` | Required for `create` | Downloadable files to upload |

**Response:**
```json
{
  "id": "uuid",
  "files": []
}
```

---

### Delete Benefit

```
POST /v1/benefit/delete
```

Deletes a benefit (album, video, gallery, or files) from a collection. Requires authentication and collection ownership.

**Request Body:**
```json
{
  "cookie": "string",
  "benefit_type": "string",
  "benefit_id": "string"
}
```

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
```json
{
  "cookie": "string",
  "receiver_id": "string",
  "title": "string",
  "message": "string"
}
```

**Side Effects:**
- Sends Brevo transactional email (template 40)
- Sends Mixpanel event

**Response:**
```json
{
  "id": "uuid",
  "sender": {
    "id": "uuid",
    "display_name": "string",
    "avatar": "string"
  },
  "message": "string"
}
```

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

**Response:**
```json
[
  {
    "id": "uuid",
    "sender": {
      "id": "uuid",
      "display_name": "string",
      "avatar": "string"
    },
    "receiver": {
      "id": "uuid",
      "display_name": "string",
      "avatar": "string"
    },
    "message_count": 5,
    "last_message_date": "2023-01-01T00:00:00Z"
  }
]
```

---

### Create Inbox Message

```
POST /v1/arena/inbox/createMessage
```

Sends a new message in an existing inbox conversation. Requires authentication.

**Request Body:**
```json
{
  "cookie": "string",
  "inbox_id": "string",
  "message": "string"
}
```

**Side Effects:** Sends Mixpanel event.

**Response:**
```json
{
  "id": "uuid",
  "creator": {
    "id": "uuid",
    "display_name": "string",
    "avatar": "string"
  },
  "message": "string"
}
```

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
  "inboxInfo": [
    { 
      "title": "string", 
      "sender": {
        "id": "uuid",
        "display_name": "string",
        "avatar": "string"
      }, 
      "receiver": {
        "id": "uuid",
        "display_name": "string",
        "avatar": "string"
      }
    }
  ],
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
```json
{
  "cookie": "string",
  "content": "string"
}
```

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

---

## Additional Endpoints

*(Discovered from source code)*

### Actions API (`views/arena/actions.mjs`)

#### Fetch By Date
```http
POST /v1/arena/action/fetchByDate
```
**Request Body:**
```json
{
  "ids": [],
  "page": 0,
  "lastDate": "string"
}
```

#### Account Setup
```http
POST /v1/arena/action/accountSetup
```
**Request Body:**
```json
{
  "type": "string",
  "email": "string",
  "return_url": "string"
}
```

### Main Arena API (`views/arena/index.mjs`)

#### Post Event
```http
POST /v1/arena/event
```
**Request Body:**
```json
{
  "cookie": "string",
  "event": "string",
  "eventId": "string"
}
```

#### Page View
```http
POST /v1/arena/pageView
```
**Request Body:**
```json
{
  "cookie": "string",
  "path": "string"
}
```

#### Feed
```http
POST /v1/arena/feed
```
**Request Body:**
```json
{
  "page": 0,
  "forYou": true,
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

#### Fetch Feed by Date
```http
POST /v1/arena/fetchByDate
```
**Request Body:**
```json
{
  "cookie": "string",
  "ids": [],
  "lastDate": "string",
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

#### Get Post Comments
```http
POST /v1/arena/comments
```
**Request Body:**
```json
{
  "post_id": "string"
}
```

#### Profile Feed
```http
POST /v1/arena/profile/feed
```
**Request Body:**
```json
{
  "id": "string",
  "page": 0,
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
  "wall": true
}
```

#### Get Profile
```http
GET /v1/arena/profile/:id
```
**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Profile ID |

#### Check Leaderboard
```http
POST /v1/arena/checkLeaderboard
```
**Request Body:**
```json
{
  "cookie": "string",
  "divisionId": "string",
  "genreId": "string"
}
```

#### Get Launchpads
```http
GET /v1/arena/launchpads
```

#### Get Latest Launchpad
```http
GET /v1/arena/launchpad/latest/:user
```
**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `user` | `string` | User ID |

#### Post Event ID
```http
POST /v1/arena/events/:id
```
**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Event ID |

**Request Body:**
```json
{
  "id": "string"
}
```

#### Change User Role
```http
POST /v1/arena/changeUserRole
```
**Request Body:**
```json
{
  "cookie": "string",
  "role": "string"
}
```

#### Check Username
```http
POST /v1/arena/checkUsername
```
**Request Body:**
```json
{
  "username": "string"
}
```

### Arena Collections API (`views/arena/collections/index.mjs`)

#### Get Collections
```http
GET /v1/arena/collections
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number |
| `limit` | `number` | Items limit |

#### Get Collections by Username
```http
GET /v1/arena/collections/:username
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Status filter |
| `type` | `string` | Type filter |
| `limit` | `number` | Items limit |


#### Get Collections by Artist
```http
GET /v1/arena/collections/byArtist/:id
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Status filter |
| `type` | `string` | Type filter |
| `limit` | `number` | Items limit |
| `page` | `number` | Page number |
| `isFree` | `boolean` | Free collection flag |

#### Get Artist NFTs
```http
GET /v1/arena/collections/artist/nft/:id/:limit?/:page?
```



### Courses API (`views/arena/courses/index.mjs`)

#### Get Course Intro
```http
GET /v1/courses/intro/:id
```
**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Course ID |

#### Get Course Class
```http
GET /v1/courses/class/:id
```
**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Class ID |

### Leaderboard API (`views/arena/leaderboard/index.mjs`)

#### Get My Leaderboard
```http
GET /v1/arena/leaderboard/me
```

#### Get Latest Leaderboard
```http
GET /v1/arena/leaderboard/latest
```

### Gallery API (`views/arena/gallery/index.mjs`)

#### Get Galleries
```http
GET /v1/albums/galleries
```

#### Get Gallery by ID
```http
GET /v1/albums/gallery/:id
```

#### Delete Gallery
```http
DELETE /v1/albums/gallery/:id
```

#### Get Gallery by Slug
```http
GET /v1/albums/:slug
```

#### Get Gallery Intro
```http
GET /v1/albums/intro/:id
```

#### Get Gallery Class
```http
GET /v1/albums/class/:id
```
