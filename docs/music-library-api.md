# Music Library API

> **Source:** `views/music_library/`  
> **Modules:** `library.mjs`  
> **Base URL:** `/v1/music`

## Overview

The Music Library API is responsible for managing tracks, albums, and playlists for artists/users.

---

## Endpoints

### Get Library

```http
GET /v1/music/library
```

Fetches the complete library of music tracks for the authenticated user/artist. Supports caching and query filters.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `cookie` | `string` | Yes | Valid user session cookie |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `artist` | `string` | No | ID of the artist to filter by |
| `cacheUpdate`| `boolean`| No | If true, invalidates and updates the cache |

**Response (200 OK):**
```json
[
  {
    "track": {
      "id": "file-id-string",
      "title": "Track Title",
      "artwork": "banner-id-string",
      "artist": {
        "name": "Artist First Name",
        "username": "artistusername",
        "avatar": "avatar-id-string"
      }
    }
  }
]
```

---

### Get Albums

```http
GET /v1/music/albums
```

Fetches the music albums for the user. Supports fetching draft and published albums, genres, tracks, and attached tags.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `cookie` | `string` | Yes | Valid user session cookie |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `artist` | `string` | No | ID of the artist to filter by |
| `cacheUpdate`| `boolean`| No | If true, invalidates and updates the cache |

**Response (200 OK):**
```json
[
  {
    "album": {
      "id": "collection-id-string",
      "name": "Album Name",
      "artwork": "banner-id-string",
      "artist": {
        "name": "First Name",
        "display_name": "Display Name",
        "username": "artistusername",
        "avatar": "avatar-id-string"
      },
      "number_of_tracks": 10,
      "tracks": [
        {
          "id": "track-file-id",
          "title": "Track Title",
          "artwork": "banner-id-string",
          "artist": {
            "name": "First Name",
            "display_name": "Display Name",
            "username": "artistusername",
            "avatar": "avatar-id-string"
          }
        }
      ],
      "release_date": 2023
    }
  }
]
```

---

### Get Album Details

```http
GET /v1/music/album/:id
```

Fetches deep details of a specific album, including its tracklist, artwork, genre, tags, and status.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The ID of the album |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Valid user session cookie |

**Response (200 OK):**
```json
[
  {
    "track": {
      "id": "file-id-string",
      "title": "Track Title",
      "artwork": "banner-id-string",
      "artist": {
        "name": "Artist First Name",
        "display_name": "Display Name",
        "username": "artistusername",
        "avatar": "avatar-id-string"
      }
    }
  }
]
```
