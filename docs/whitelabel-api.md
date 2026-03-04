# Whitelabel API

> **Source:** `views/whitelabel/`  
> **Modules:** `domainConfig.mjs`, `albumBlock.mjs`, `youtubeBlock.mjs`, `contactBlock.mjs`, `tracksBlock.mjs`, `bannerBlock.mjs`, `pushFmBlock.mjs`, `events/events.mjs`  
> **Base URL:** `/v1/blocks`

## Overview

The Whitelabel API manages content blocks and domain configuration for artist whitelabel sites. Each artist can configure a custom domain and build their site from modular blocks (banners, tracks, YouTube videos, contact forms, events, etc.).

---

## Domain Config API

> **Source:** `views/whitelabel/domainConfig.mjs`

### Get Domain Config

```
GET /v1/blocks/domain/:domain
```

Fetches the domain configuration (theme, blocks, ordering) for a whitelabel site.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `domain` | `string` | Domain name or subdomain |

---

### Update Domain Config

```
POST /v1/blocks/domain/update
```

Updates domain configuration (theme, colors, fonts, block ordering). Requires authentication and ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `domain_id` | `string` | Yes | Domain config ID |
| `config` | `object` | Yes | Configuration settings |

---

### Get Domain by User

```
POST /v1/blocks/domain/user
```

Fetches the domain configuration for the authenticated user. Requires authentication.

---

## Album Block API

> **Source:** `views/whitelabel/albumBlock.mjs`  
> **Base URL:** `/v1/blocks`

### Create Album Block

```
POST /v1/blocks/album
```

Creates an album content block for the whitelabel site. Requires authentication. Subject to `planLimitsMiddleware`.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | Block name |
| `fields.block_type` | `string` | Yes | Block type (`album_block`) |
| `fields.description` | `string` | No | Description |
| `files.cover` | `File` | No | Album cover image |

---

### Update Album Block

```
POST /v1/blocks/album/:id
```

Updates an album block. Requires authentication and ownership.

---

### Delete Album Block

```
DELETE /v1/blocks/album/:id
```

Deletes an album block. Requires authentication and ownership.

---

## YouTube Block API

> **Source:** `views/whitelabel/youtubeBlock.mjs`

### Create YouTube Block

```
POST /v1/blocks/youtube
```

Creates a YouTube video embed block. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `url` | `string` | Yes | YouTube video URL |
| `title` | `string` | No | Block title |
| `description` | `string` | No | Description |

---

### Update YouTube Block

```
POST /v1/blocks/youtube/:id
```

Updates a YouTube block. Requires authentication and ownership.

---

### Delete YouTube Block

```
DELETE /v1/blocks/youtube/:id
```

Deletes a YouTube block. Requires authentication.

---

## Contact Block API

> **Source:** `views/whitelabel/contactBlock.mjs`

### Create Contact Block

```
POST /v1/blocks/contact
```

Creates a contact form block. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `email` | `string` | Yes | Contact email |
| `title` | `string` | No | Block title |
| `description` | `string` | No | Description |

---

### Update Contact Block

```
POST /v1/blocks/contact/:id
```

Updates a contact block. Requires authentication.

---

### Delete Contact Block

```
DELETE /v1/blocks/contact/:id
```

Deletes a contact block. Requires authentication.

---

### Submit Contact Form

```
POST /v1/blocks/contact/submit
```

Submits a message through a contact form block (public endpoint).

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `block_id` | `string` | Yes | Contact block ID |
| `name` | `string` | Yes | Sender name |
| `email` | `string` | Yes | Sender email |
| `message` | `string` | Yes | Message content |

---

## Tracks Block API

> **Source:** `views/whitelabel/tracksBlock.mjs`

### Create Tracks Block

```
POST /v1/blocks/tracks
```

Creates a tracks/music block with audio file uploads. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | Block name |
| `fields.genre` | `string` | No | Genre ID |
| `files.tracks` | `File[]` | Yes | Audio track files |
| `files.cover` | `File` | No | Cover image |

---

### Update Tracks Block

```
POST /v1/blocks/tracks/:id
```

Updates a tracks block (add/remove tracks, change cover). Requires authentication.

---

### Delete Tracks Block

```
DELETE /v1/blocks/tracks/:id
```

Deletes a tracks block. Requires authentication.

---

## Banner Block API

> **Source:** `views/whitelabel/bannerBlock.mjs`

### Create Banner Block

```
POST /v1/blocks/banner
```

Creates a banner image block. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.title` | `string` | No | Banner title |
| `fields.subtitle` | `string` | No | Banner subtitle |
| `fields.link` | `string` | No | Banner link URL |
| `files.image` | `File` | Yes | Banner image |

---

### Update Banner Block

```
POST /v1/blocks/banner/:id
```

Updates a banner block. Requires authentication.

---

### Delete Banner Block

```
DELETE /v1/blocks/banner/:id
```

Deletes a banner block. Requires authentication.

---

## PushFM Block API

> **Source:** `views/whitelabel/pushFmBlock.mjs`

### Create PushFM Block

```
POST /v1/blocks/pushfm
```

Creates a PushFM (music distribution/pre-save) block. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.title` | `string` | Yes | Block title |
| `fields.release_date` | `string` | No | Release date |
| `fields.links` | `string` | No | Streaming links (JSON) |
| `files.artwork` | `File` | No | Artwork image |

---

### Update PushFM Block

```
POST /v1/blocks/pushfm/:id
```

Updates a PushFM block. Requires authentication.

---

### Delete PushFM Block

```
DELETE /v1/blocks/pushfm/:id
```

Deletes a PushFM block. Requires authentication.

---

## Events API

> **Source:** `views/whitelabel/events/events.mjs`

### Create Event

```
POST /v1/blocks/events
```

Creates an event with image upload. Requires authentication. Subject to `planLimitsMiddleware`.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.title` | `string` | Yes | Event title |
| `fields.description` | `string` | No | Event description |
| `fields.event_date` | `string` | Yes | Event date |
| `fields.event_time` | `string` | No | Event time |
| `fields.location` | `string` | No | Location |
| `fields.ticket_url` | `string` | No | Ticket purchase URL |
| `fields.status` | `string` | No | Status (`draft`, `published`) |
| `files.cover_image` | `File` | No | Event cover image |

---

### Update Event

```
POST /v1/blocks/events/:id
```

Updates an existing event. Requires authentication and ownership.

---

### Delete Event

```
DELETE /v1/blocks/events/:id
```

Deletes an event. Requires authentication and ownership.

---

### Get Events by Artist

```
GET /v1/blocks/events/artist/:id
```

Fetches all published events for a specific artist (public endpoint).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Artist user ID |

---

### Get Event by ID

```
GET /v1/blocks/events/:id
```

Fetches a single event by ID (public endpoint).
