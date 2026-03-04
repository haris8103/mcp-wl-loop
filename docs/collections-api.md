# Collections API

> **Source:** `views/collections/index.mjs`  
> **Base URL:** `/v1/collections`

## Overview

The Collections API manages fan collections — creating, updating, deleting collections, and managing associated media (albums, videos, files, songs). It handles content attached to NFT collections.

---

## Endpoints

### Get Collections for User

```
GET /v1/collections
```

Fetches all collections belonging to the authenticated user. Requires authentication.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response:** Array of collection objects with attached media.

---

### Get Collection by ID

```
GET /v1/collections/:id
```

Fetches a single collection by its ID with full details including albums, videos, files, gallery, and song.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Collection ID |

---

### Create Collection Album

```
POST /v1/collections/album/create
```

Creates an album (music tracks) attached to a collection. Requires authentication and ownership.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | Album name |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `fields.genre` | `string` | No | Genre ID |
| `files.tracks` | `File[]` | Yes | Audio track files |

---

### Update Collection Album

```
POST /v1/collections/album/update/:id
```

Updates an album name, genre, or adds new tracks. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Album ID |

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | No | Updated name |
| `fields.genre` | `string` | No | Updated genre ID |
| `files.tracks` | `File[]` | No | New tracks to add |

---

### Delete Collection Album

```
POST /v1/collections/album/delete/:id
```

Deletes an album from a collection. Requires authentication and ownership.

---

### Create Collection Video

```
POST /v1/collections/video/create
```

Creates a video entry attached to a collection. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | Video name |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `files.main_video` | `File` | Yes | Main video file |
| `files.preview_video` | `File` | No | Preview/trailer video |
| `files.thumbnail` | `File` | No | Thumbnail image |

---

### Update Collection Video

```
POST /v1/collections/video/update/:id
```

Updates a video entry. Requires authentication and ownership.

---

### Delete Collection Video

```
POST /v1/collections/video/delete/:id
```

Deletes a video from a collection. Requires authentication and ownership.

---

### Create Collection Files (Documents)

```
POST /v1/collections/files/create
```

Creates a file attachment entry for a collection. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | Yes | File group name |
| `fields.collection_id` | `string` | Yes | Parent collection ID |
| `files.files` | `File[]` | Yes | Files to upload |

---

### Update Collection Files

```
POST /v1/collections/files/update/:id
```

Updates a file entry. Requires authentication and ownership.

---

### Delete Collection Files

```
POST /v1/collections/files/delete/:id
```

Deletes a file group from a collection. Requires authentication and ownership.

---

### Delete Individual File Item

```
POST /v1/collections/delete/item/:id
```

Deletes a single file item (track, video, or document). Requires authentication.

---

### Rename File

```
POST /v1/collections/rename
```

Renames a file. Requires authentication and ownership verification.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `file_id` | `string` | Yes | File ID to rename |
| `file_name` | `string` | Yes | New file name |

---

### Update Collection Song

```
POST /v1/collections/song/update
```

Updates the song attached to a collection. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.collection_id` | `string` | Yes | Collection ID |
| `files.song` | `File` | Yes | New song file |