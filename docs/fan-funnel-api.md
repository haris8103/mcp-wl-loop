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
```json
{
  "label": "string"
}
```

---

## Pre-Registration Forms API

> **Base URL:** `/v1/fan_funnel/pre_registration`

### Create Pre-Registration Form

```
POST /v1/fan_funnel/pre_registration
```

Creates a pre-registration form item. Requires authentication. Subject to `mustBeAuthenticated` and `planLimitsMiddleware`.

**Request Body (multipart/form-data):**
```json
{
  "fields.cookie": "string",
  "fields.name": "string",
  "fields.description": "string",
  "fields.required_tags": "string",
  "fields.release_date": "string",
  "files.cover_image": "file_binary"
}
```

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
```json
{
  "is_default": true
}
```

---

### Update Status

```
POST /v1/fan_funnel/pre_registration/:fan_funnel_id/:id/status
```

Updates the status of a pre-registration item. Only works on default items. Requires authentication.

**Request Body:**
```json
{
  "fields.status": "string"
}
```

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
```json
{
  "fields.name": "string",
  "fields.email": "string",
  "fields.country": "string",
  "fields.birthday": "string"
}
```

---

### Check Registration

```
POST /v1/fan_funnel/:id/register/check
```

Checks if an email has already registered for a pre-registration.

**Request Body:**
```json
{
  "fields.email": "string"
}
```

**Response:**
```json
true
```

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
```json
{
  "fields.cookie": "string",
  "fields.type": "string",
  "fields.name": "string",
  "fields.quantity": 0,
  "fields.description": "string",
  "fields.album_name": "string",
  "fields.required_tags": "string",
  "files.cover_image": "file_binary",
  "files.files": []
}
```

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
```json
{
  "fields.cookie": "string",
  "fields.file_name": "string",
  "fields.fan_funnel_id": "string"
}
```

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
