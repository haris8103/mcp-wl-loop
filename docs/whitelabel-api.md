# Whitelabel API

> **Source:** `views/whitelabel/`  
> **Modules:** `index.mjs`, `domainConfig.mjs`, `albumBlock.mjs`, `youtubeBlock.mjs`, `contactBlock.mjs`, `tracksBlock.mjs`, `bannerBlock.mjs`, `pushFmBlock.mjs`, `events/events.mjs`  
> **Base URLs:** `/v1/wl` (domains), `/v1/blocks` (content blocks)

## Overview

The Whitelabel API manages custom artist domains and modular content blocks for artist whitelabel sites. Artists can:
- Register and configure a `*.loop.fans` subdomain
- Build their site from modular blocks (albums, tracks, banners, YouTube, contact, PushFM, events)
- Reorder, enable/disable (draft/published), and delete blocks
- Set a website template with theme colors

The system uses a **Content Blocks** container that holds a list of **blocks** (each linked to a specific block type like album, tracks, youtube, etc.). Blocks are associated with a domain and subject to **plan limits**.

---

## Domain Config API

> **Source:** `views/whitelabel/domainConfig.mjs`  
> **Base URL:** `/v1/wl`

### Check Domain Availability

```
GET /v1/wl/domain/check?domain=<domain>
```

Checks if a `.loop.fans` subdomain is available. **Public endpoint**.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | `string` | Yes | Full domain (must end with `.loop.fans`) |

**Response (200):**
```json
{ "available": true, "message": "Domain is available" }
```

**Error (409 — already taken):**
```json
{ "available": false, "error": "Domain already exists" }
```

**Error (400 — invalid format):**
```json
{ "available": false, "error": "Domain must end with .loop.fans" }
```

---

### Get Domain Config (Authenticated)

```
GET /v1/wl/domain
```

Fetches the domain configuration for the authenticated user. Requires `user_cookie` header.

**Response (200):**
```json
{
  "id": "domain_id",
  "domain": "artist.loop.fans",
  "custom_domain": null,
  "status": "published",
  "collection_access": true,
  "onBoard": "completed",
  "logo": { "id": "file_id" },
  "banner": { "id": "file_id" },
  "website_template": { "id": 1, "name": "Template Name" },
  "settings": { "theme": "dark", "colors": { "primary": "#8b5cf6", "secondary": "#6366f1" } }
}
```

---

### Create Domain

```
POST /v1/wl/domain
```

Creates a new `.loop.fans` domain. Requires authentication via `user_cookie` header.

**Request Body:**
```json
{
  "domain": "subdomain.loop.fans",
  "logo": {
    "id": "file_uuid"
  },
  "banner": {
    "id": "file_uuid"
  },
  "settings": {
    "theme": "dark",
    "colors": {
      "primary": "#ffffff",
      "secondary": "#000000"
    }
  }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "domain": "string",
  "status": "published",
  "logo": "file_id",
  "banner": "file_id",
  "settings": {}
}
```

**Side Effects:**
- Brevo: Adds user to list 60 (Started Onboarding)
- Mixpanel: `"Domain Created"` event

**Frontend contract:** `Fans_Studio` sends JSON with `Content-Type: application/json` and `user_cookie` in the header. Create/update flows may also include fields such as `custom_domain`, `collection_access`, `onBoard`, `template_id`, SEO fields, social links, and appearance settings depending on the page.

---

### Update Domain

```
PATCH /v1/wl/domain/:domain
```

Updates an existing domain. Verifies ownership by matching domain name + user profile. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `domain` | `string` | Current domain name to update |

**Request Body:**
```json
{
  "domain": "subdomain.loop.fans",
  "logo": {
    "id": "file_uuid"
  },
  "banner": {
    "id": "file_uuid"
  },
  "settings": {
    "theme": "dark",
    "colors": {
      "primary": "#ffffff",
      "secondary": "#000000"
    }
  },
  "onBoard": "completed",
  "template_id": 1
}
```

**Response (200):** 
```json
{
  "id": "uuid",
  "domain": "string"
}
```

**Side Effects:** Mixpanel: `"Domain Updated"` event.

---

### Update Active Template

```
PATCH /v1/wl/domain/active_template/:domain
```

Changes the active website template for a domain. Also updates the domain's color settings based on the template's `primary_color`, `secondary_color`, and `mode`.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `domain` | `string` | Domain name |

**Request Body:**
```json
{
  "active_template": 0
}
```

**Response (200):** Updated domain with `settings` and `website_template`.

**Side Effects:** Mixpanel: `"Domain Active Template Updated"` event.

---

## Content Blocks API

> **Source:** `views/whitelabel/domainConfig.mjs`  
> **Base URL:** `/v1/wl`

The content blocks system is the container that holds all the blocks (album, tracks, banner, youtube, contact, pushfm) associated with a domain.

### Get Content Blocks

```
GET /v1/wl/content_blocks/:domain
```

Fetches all content blocks for a domain. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `domain` | `string` | Domain ID or name |

**Response (200):**
```json
{
  "id": "content_blocks_id",
  "blocks": [
    {
      "id": "block_relationship_id",
      "order": 0,
      "date_created": 1710000000000,
      "collection": "album",
      "item": { "id": "...", "name": "...", "gallery": { ... } }
    }
  ]
}
```

**Frontend contract:** `Fans_Studio/src/app/hooks/useContentBlocks.ts` passes the domain config `id` as `:domain`, includes `user_cookie`, and consumes this JSON response directly.

---

### Enable Content Blocks for Domain

```
POST /v1/wl/content_blocks/:domain
```

Creates a new content blocks container and links it to a domain. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `domain` | `string` | Domain ID to associate |

**Response (201):** `{ "id": "content_blocks_id" }`

**Side Effects:**
- Brevo: Removes from list 60, adds to list 61 (Finished Onboarding)
- Mixpanel: `"Content Blocks Enabled"` event

---

### Create Content Blocks

```
POST /v1/wl/content_blocks
```

Creates a content blocks container and optionally links to a domain. Requires authentication.

**Request Body:**
```json
{
  "domain": "subdomain.loop.fans"
}
```

**Response (201):** `{ "message": "Content blocks created successfully" }`

---

### Update Content Blocks

```
PATCH /v1/wl/content_blocks/:id
```

Updates the blocks array for a content blocks container. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Content blocks ID |

**Request Body:**
```json
{
  "blocks": [
    {
      "collection": "album",
      "item": {
        "id": "album_id_uuid",
        "name": "Album Name"
      }
    }
  ]
}
```

**Frontend contract:** `Fans_Studio/src/app/hooks/useContentBlockMutations.ts` sends `blocks` as an array of `{ "id": "relationship_id", "order": 0 }` and includes `user_cookie` in the header.

**Response (200):**
```json
{
  "id": "uuid",
  "blocks": [
    {
      "id": "uuid",
      "order": 1,
      "status": "published",
      "type": "string"
    }
  ]
}
```

**Side Effects:** Mixpanel: `"Content Blocks Updated"` event.

---

### Reorder Content Blocks

```
PUT /v1/wl/content_blocks/:id/reorder
```

Reorders blocks within a content blocks container. Verifies ownership. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Content blocks ID |

**Request Body:**
```json
{
  "blocks": [
    {
      "id": "relationship_id_1",
      "order": 1
    },
    {
      "id": "relationship_id_2",
      "order": 2
    }
  ]
}
```

**Validation:**
- `blocks` must be a non-empty array
- Each block must have `id` and `order` properties
- All block IDs must exist in the current content blocks

**Response (200):**
```json
{
  "id": "uuid",
  "blocks": [
    {
      "id": "uuid",
      "order": 1,
      "status": "published",
      "type": "string"
    }
  ]
}
```

---

## Generic Block Operations

> **Source:** `views/whitelabel/youtubeBlock.mjs`

These endpoints operate on any block type (album, tracks, banner, contact, youtube, pushfm).

### Delete Block

```
DELETE /v1/blocks/:contentBlockBlocksId?contentId=<contentBlocksId>
```

Deletes a block relationship from a content blocks container. Verifies ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `contentBlockBlocksId` | `string` | The `content_blocks_blocks` item ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contentId` | `string` | Yes | The parent `content_blocks` ID |

**Response (200):**
```json
{ "message": "Content block deleted successfully", "id": "uuid" }
```

**Side Effects:** Mixpanel: `"Content Block Deleted"` event.

**Frontend contract:** `Fans_Studio/src/app/hooks/useContentBlockMutations.ts` calls this as `DELETE /v1/blocks/:blockId?contentId=<contentId>`, where `:blockId` is the content-block relationship ID. The request includes `user_cookie`.

---

### Update Block Status

```
PATCH /v1/blocks/update_status/:contentBlockBlocksId
```

Updates the `status` field (e.g. `"draft"` / `"published"`) of any block type. Verifies ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `contentBlockBlocksId` | `string` | The `content_blocks_blocks` item ID |

**Request Body:**
```json
{
  "status": "published"
}
```

**Frontend contract:** `Fans_Studio` sends JSON `formData` from the status form and includes `Content-Type: application/json` plus `user_cookie`.

**Supported Collections:** `album`, `tracks_block`, `content_banner`, `contact_block`, `youtube_block`, `push_fm`, `forms_block`, `free_drops`, `paid_drops`

**Response (200):**
```json
{ "message": "Content block updated successfully", "id": "uuid" }
```

---

## Album Block API

> **Source:** `views/whitelabel/albumBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create Album Block

```
POST /v1/blocks/album_block
```

Creates a photo/image album block. Requires authentication. Subject to plan content blocks limit.

**Request Body (JSON):**
```json
{
  "name": "My Album",
  "description": "Album Description",
  "contentBlockId": "content_block_container_uuid",
  "layout": "grid",
  "gallery": {
    "images": [
      {
        "directus_files_id": {
          "id": "image_file_uuid"
        }
      }
    ]
  }
}
```

**Response (200):**
```json
{
  "data": {
    "id": "album_id",
    "name": "My Album",
    "description": "string",
    "gallery": {
      "id": "gallery_id",
      "images": [{ "featured": true, "directus_files_id": { "id": "uuid" } }]
    }
  }
}
```

**Side Effects:** Mixpanel: `"Album Block Created"`.

---

### Update Album Block

```
PATCH /v1/blocks/album_block/:id
```

Updates an existing album block. Requires authentication.

**Request Body (JSON):**
```json
{
  "id": "album_id",
  "contentBlockId": "content_blocks_id",
  "name": "Updated Album",
  "description": "Updated description",
  "status": "published",
  "layout": "grid",
  "gallery": {
    "images": [
      {
        "directus_files_id": {
          "id": "image_file_uuid"
        }
      }
    ]
  }
}
```

**Response (200):**
```json
{
  "message": "Updated album data."
}
```

---

## YouTube Block API

> **Source:** `views/whitelabel/youtubeBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create YouTube Block

```
POST /v1/blocks/youtube_block
```

Creates a YouTube video embed block. Subject to plan content blocks limit.

**Request Body (JSON):**
```json
{
  "id": "youtube_block_id",
  "contentBlockId": "content_blocks_id",
  "url": "https://youtube.com/watch?v=string",
  "status": "published"
}
```

**Response (200):**
```json
{ 
  "data": { 
    "id": "uuid", 
    "name": "string", 
    "data": [] 
  } 
}
```

**Side Effects:** Mixpanel: `"Youtube Block Created"`.

---

### Update YouTube Block

```
PUT /v1/blocks/youtube_block/:id
```

Updates a YouTube block. Verifies content block ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | YouTube block ID |

**Request Body (JSON):**
```json
{
  "blockId": "string",
  "title": "string",
  "description": "string",
  "embeds": [],
  "status": "string",
  "layout": "string"
}
```

**Response (200):**
```json
{
  "message": "Updated YouTube block data."
}
```

---

### Create Forms Block

```http
POST /v1/blocks/forms_block
```

Creates a forms block. Requires authentication and is subject to plan limits.

**Request Body:**
```json
{
  "blockId": "string"
}
```

---

### Create Free Drops Block

```http
POST /v1/blocks/free_drops
```

Creates a free drops block. Requires authentication and is subject to plan limits.

**Request Body:**
```json
{
  "blockId": "string"
}
```

---

### Create Paid Drops Block

```http
POST /v1/blocks/paid_drops
```

Creates a paid drops block. Requires authentication and is subject to plan limits.

**Request Body:**
```json
{
  "blockId": "string"
}
```


---

## Contact Block API

> **Source:** `views/whitelabel/contactBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create Contact Block

```
POST /v1/blocks/contact_block
```

Creates a contact form/info block. Subject to plan content blocks limit.

**Request Body (JSON):**
```json
{
  "title": "string",
  "description": "string",
  "contactInfo.contactMethods": [],
  "domain": "string",
  "blockId": "string"
}
```

**Response (200):**
```json
{ 
  "data": { 
    "id": "uuid", 
    "title": "string", 
    "methods": [] 
  } 
}
```

---

### Update Contact Block

```
PUT /v1/blocks/contact_block/:id
```

Updates a contact block. Verifies content block ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Contact block ID |

**Request Body (JSON):**
```json
{
  "blockId": "string",
  "title": "string",
  "description": "string",
  "methods": [],
  "status": "string"
}
```

**Response (200):**
```json
{
  "message": "Updated contact block data."
}
```

---

## Tracks Block API

> **Source:** `views/whitelabel/tracksBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create Tracks Block

```
POST /v1/blocks/tracks_block
```

Creates a music tracks block with audio file uploads. Requires authentication. Subject to plan limits.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.name": "string",
  "fields.genre": "string",
  "fields.contentBlockId": "string",
  "fields.layout": "string",
  "files.tracks": [],
  "files.cover": "file_binary"
}
```

**Response (200):**
```json
{
  "message": "Created tracks block with track listing."
}
```

---

### Update Tracks Block

```
PUT /v1/blocks/tracks_block/:id
```

Updates a tracks block (add/remove tracks, change cover, rename). Requires authentication and ownership.

---

## Banner Block API

> **Source:** `views/whitelabel/bannerBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create Banner Block

```
POST /v1/blocks/banner_block
```

Creates a banner image block with image upload. Requires authentication. Subject to plan limits.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.title": "string",
  "fields.subtitle": "string",
  "fields.link": "string",
  "fields.contentBlockId": "string",
  "fields.layout": "string",
  "files.image": "file_binary"
}
```

**Response (200):**
```json
{
  "message": "Created banner block."
}
```

---

### Update Banner Block

```
PATCH /v1/blocks/banner_block/:id
```

Updates a banner block. Requires authentication and ownership.

---

## PushFM Block API

> **Source:** `views/whitelabel/pushFmBlock.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create PushFM Block

```
POST /v1/blocks/push_fm
```

Creates a PushFM (music distribution/pre-save) block. Requires authentication. Subject to plan limits.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.title": "string",
  "fields.release_date": "string",
  "fields.links": "string",
  "fields.contentBlockId": "string",
  "fields.layout": "string",
  "files.artwork": "file_binary"
}
```

**Response (200):**
```json
{
  "message": "Created PushFM block."
}
```

---

### Update PushFM Block

```
PATCH /v1/blocks/push_fm/:id
```

Updates a PushFM block. Requires authentication and ownership.

---

### Get PushFM Blocks

```
GET /v1/blocks/push_fm
```

Fetches PushFM blocks with optional filtering by ID, pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Optional PushFM block ID |
| `limit` | `number` | Items per page (default: 10) |
| `page` | `number` | Page number (default: 1) |

---

## Events API

> **Source:** `views/whitelabel/events/events.mjs`  
> **Middleware:** `mustBeAuthenticated`, `planLimitsMiddleware`

### Create Event

```
POST /v1/wl/events
```

Creates an event container linked to a domain. Requires authentication.

**Request Body:**
```json
{
  "domain": "subdomain.loop.fans"
}
```

**Frontend contract:** `Fans_Studio/src/app/api/events.api.ts` uses this as an "enable events" call and sends `user_cookie`.

---

### Get Events

```
GET /v1/wl/events
```

Fetches all events for the authenticated user's domain. Requires authentication.

**Frontend contract:** `Fans_Studio/src/app/api/events.api.ts` returns `response.data.data`, so the API response must contain the top-level `data` property shown below.

**Response (200):**
```json
{
  "data": [
    {
      "id": "number",
      "domain": { "domain": "string" },
      "banner": { "id": "string" },
      "event_items": [
        {
          "id": "number",
          "status": "string",
          "title": "string",
          "venue": "string",
          "date": "string",
          "ticket_price": "number",
          "is_sold_out": "boolean",
          "event_url": "string"
        }
      ],
      "count": "number"
    }
  ]
}
```

---

### Update Event Banner

```
PATCH /v1/wl/events/:id
```

Updates the banner image of an event. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Event ID |

**Request Body (multipart/form-data):**
```json
{
  "fields.banner": "string",
  "fields.domain": "string",
  "files.image": "file_binary"
}
```

---

### Create Event Item

```
POST /v1/wl/events/:id/items
```

Creates a new event item within an event. Requires authentication. Subject to plan limits.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Event ID |

**Request Body:**
```json
{
  "title": "string",
  "venue": "string",
  "date": "string",
  "ticket_price": 0,
  "is_sold_out": false,
  "event_url": "string",
  "domain": "string",
  "status": "string"
}
```

---

### Update Event Item

```
PATCH /v1/wl/events/:eventId/items/:itemId
```

Updates an existing event item. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `eventId` | `string` | Event ID |
| `itemId` | `string` | Event item ID |

**Request Body:**
```json
{
  "title": "string",
  "status": "string",
  "venue": "string",
  "date": "string",
  "ticket_price": 0,
  "is_sold_out": false,
  "event_url": "string",
  "domain": "string"
}
```

### Delete Event Item

```
DELETE /v1/wl/events/:eventId/items/:itemId?domain=<domain>
```

Deletes an event item. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `eventId` | `string` | Event ID |
| `itemId` | `string` | Event item ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `domain` | `string` | Yes | Domain name for ownership verification |

## Architecture Notes

### Content Block System

The whitelabel site uses a layered structure:

```
Domain → Content Blocks (container) → Blocks (items)
```

- **Domain** (`/v1/wl/domain`): The artist's `*.loop.fans` site with settings, theme, logo, banner
- **Content Blocks** (`/v1/wl/content_blocks`): A container linked to the domain, holds the list of blocks
- **Blocks** (`/v1/blocks/*_block`): Individual content items (album, tracks, youtube, etc.)
- Each block is linked to the content blocks container via a `content_blocks_blocks` junction item

### Block Types (Collections)

| Collection | Directus Table | Description |
|-----------|---------------|-------------|
| `album` | `album` | Photo/image gallery album |
| `tracks_block` | `tracks_block` | Music tracks with audio files |
| `content_banner` | `content_banner` | Banner image with link |
| `youtube_block` | `youtube_block` | YouTube video embeds |
| `contact_block` | `contact_block` | Contact methods/info |
| `push_fm` | `push_fm` | Music pre-save/distribution links |

### Key Middleware

- **`mustBeAuthenticated`**: Validates auth cookie before route handler
- **`planLimitsMiddleware`**: Fetches user's subscription plan limits (stored in `ctx.state.plan_feature_limits`)
- **`contentBlocksCount`**: Checks current block count against plan's `content_blocks` limit

### Integrations

- **Mixpanel**: All create/update/delete operations fire tracking events
- **Brevo**: Domain creation triggers list management (list 60 → 61 for onboarding flow)
- **Directus**: All data persisted via GraphQL mutations to Directus backend
