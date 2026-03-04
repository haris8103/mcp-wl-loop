# Fan Funnel API

> **Source:** `views/fan_funnel/`  
> **Modules:** `index.mjs`, `products/pre_registration_form.mjs`, `products/pre_registration_submissions.mjs`, `products/pre_release_collection.mjs`

## Overview

The Fan Funnel API manages fan engagement funnels, including pre-registration forms and pre-release collections. Artists can create funnels to capture fan sign-ups before product launches.

---

## Fan Funnel Core

> **Base URL:** `/v1/fan_funnel`

### Get Fan Funnel

```
GET /v1/fan_funnel
```

Fetches the authenticated user's fan funnel with its items (pre-registrations). Requires authentication.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Auth cookie |

**Response:**
```json
{
  "fan_funnel": {
    "id": "string",
    "label": "string",
    "items": [
      {
        "id": "string",
        "collection": "string",
        "item": {
          "id": "string",
          "name": "string",
          "quantity": "number",
          "description": "string",
          "cover_image": { "id": "string", "title": "string" },
          "release_date": "string",
          "required_tags": [],
          "is_default": "boolean"
        }
      }
    ]
  },
  "count": "number"
}
```

---

### Create Fan Funnel

```
POST /v1/fan_funnel
```

Creates a new fan funnel for the authenticated artist. Requires authentication.

---

### Update Fan Funnel Label

```
PATCH /v1/fan_funnel
```

Updates the label of the fan funnel. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | Yes | Updated label |

---

## Pre-Registration Forms API

> **Base URL:** `/v1/fan_funnel/pre_registration`

### Create Pre-Registration Form

```
POST /v1/fan_funnel/pre_registration
```

Creates a pre-registration form item. Requires authentication. Subject to `mustBeAuthenticated` and `planLimitsMiddleware`.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.name` | `string` | No | Form name |
| `fields.description` | `string` | No | Description |
| `fields.required_tags` | `string` | No | Required tags |
| `fields.release_date` | `string` | No | Release date (ISO format) |
| `files.cover_image` | `File` | No | Cover image |

---

### Update Pre-Registration Form

```
POST /v1/fan_funnel/pre_registration/:id
```

Updates an existing pre-registration form. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Pre-registration item ID |

---

### Get Pre-Registration Form

```
GET /v1/fan_funnel/pre_registration/:id
```

Fetches a pre-registration form by fan funnel ID. Returns the default pre-registration item with artist info.

---

### Delete Pre-Registration Form

```
DELETE /v1/fan_funnel/pre_registration/:fan_funnel_id/:id
```

Deletes a pre-registration form item. Requires authentication and ownership.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `fan_funnel_id` | `string` | Fan funnel ID |
| `id` | `string` | Item ID to delete |

---

### Update Default Status

```
POST /v1/fan_funnel/pre_registration/:fan_funnel_id/:id/default
```

Sets an item as the default pre-registration form, un-setting all others. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `is_default` | `boolean` | Yes | Whether this is the default form |

---

### Update Status

```
POST /v1/fan_funnel/pre_registration/:fan_funnel_id/:id/status
```

Updates the status of a pre-registration item. Only works on default items. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.status` | `string` | Yes | New status value |

---

### Get Form Fans Count

```
GET /v1/fan_funnel/pre_registration/fans/:id/count
```

Fetches the distinct email count of fans who submitted to a pre-registration form.

---

## Pre-Registration Submissions API

> **Base URL:** `/v1/fan_funnel`

### Submit Registration

```
POST /v1/fan_funnel/:id/register
```

Submits a fan registration to a pre-registration form. Validates the form is open and not expired.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.name` | `string` | No | Fan name |
| `fields.email` | `string` | No | Fan email |
| `fields.country` | `string` | No | Country |
| `fields.birthday` | `string` | No | Birthday |

---

### Check Registration

```
POST /v1/fan_funnel/:id/register/check
```

Checks if an email has already registered for a pre-registration.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.email` | `string` | Yes | Email to check |

**Response:** `true` if already registered, `404` if not found.

---

### Get Submission Counts by IDs

```
GET /v1/fan_funnel/pre_registration_submissions/count?ids=id1,id2
```

Fetches distinct email counts for multiple pre-registration IDs.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `ids` | `string` | Comma-separated pre-registration IDs |

---

### Get Form Fans

```
GET /v1/fan_funnel/pre_registration_submissions/fans?id=xxx
```

Fetches all submissions for a pre-registration form by ID.

---

### Get Artist Form Fans

```
POST /v1/fan_funnel/pre_registration/artist/fans
```

Fetches all unique fan submissions for the authenticated artist, with pagination. Requires `mustBeAuthenticated` middleware.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Items per page (default: 20) |

---

## Pre-Release Collections API

> **Base URL:** `/v1/fan_funnel/pre_release_collection`

### Create Pre-Release Collection

```
POST /v1/fan_funnel/pre_release_collection
```

Creates a pre-release collection (music, videos, files) with associated media files. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.type` | `string` | Yes | Content type (e.g., "music", "video") |
| `fields.name` | `string` | No | Collection name |
| `fields.quantity` | `number` | No | Quantity available |
| `fields.description` | `string` | No | Description |
| `fields.album_name` | `string` | No | Album name |
| `fields.required_tags` | `string` | No | Required tags |
| `files.cover_image` | `File` | No | Cover image |
| `files.files` | `File[]` | No | Content files |

---

### Update Pre-Release Collection

```
POST /v1/fan_funnel/pre_release_collection/:id
```

Updates a pre-release collection. Requires authentication and ownership.

---

### Rename File in Pre-Release Collection

```
PATCH /v1/fan_funnel/pre_release_collection/:id
```

Renames a file in a pre-release collection. Requires authentication and ownership.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.file_name` | `string` | Yes | New file name |
| `fields.fan_funnel_id` | `string` | Yes | Fan funnel ID |

---

### Delete Pre-Release Collection

```
DELETE /v1/fan_funnel/pre_release_collection/:fan_funnel_id/:id
```

Deletes a pre-release collection. Requires authentication and ownership.

---

### Delete File from Pre-Release Collection

```
DELETE /v1/fan_funnel/pre_release_collection/delete-file/:fan_funnel_id/:fileId
```

Deletes a specific file from a pre-release collection. Requires authentication and ownership.
