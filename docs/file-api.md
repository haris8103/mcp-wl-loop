# File API

> **Source:** `views/files/`  
> **Modules:** `uploadFile.mjs`, `renameFile.mjs`  
> **Base URL:** `/v1/file`

## Overview

The File API provides endpoints for uploading, retrieving metadata, and renaming files within the system. It integrates with Directus for storage and management, utilizing `multer` for handling multipart/form-data uploads.

---

## Endpoints

### Upload File

```
POST /v1/file/upload
```

Uploads a file to the system. The file is temporarily stored on the server before being transferred to Directus.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes (or `cookie`) | Authentication cookie |
| `cookie` | `string` | No | Alternative authentication cookie |

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files.file` | `File` | Yes | The file to upload |

**Validation:**
- **Max File Size:** 10MB
- **Allowed Types:** `jpeg`, `jpg`, `png`, `gif`, `pdf`, `doc`, `docx`

**Response:**
Returns the Directus file object upon successful upload.

---

### Get File Info

```
GET /v1/file/:fileId
```

Fetches metadata for a specific file by its ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `fileId` | `string` | The unique ID of the file |

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `user_cookie` | `string` | Yes | Authentication cookie |

**Response (200 OK):**
```json
{
  "id": "string",
  "title": "string",
  "filename_download": "string",
  "type": "string",
  "filesize": "number",
  "created_by": "string"
}
```

---

### Rename File

```
POST /v1/file/rename
```

Updates the title of an existing file. Requires that the authenticated user is the owner (creator) of the file.

**Request Body (JSON):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie |
| `file_id` | `string` | Yes | The ID of the file to rename |
| `file_name` | `string` | Yes | The new title for the file |

**Logic:**
1. Validates the user's cookie.
2. Checks if the user is the creator of the specified file.
3. Updates the `title` field in Directus.

**Response (200 OK):**
```json
{
  "file_id": "string",
  "file_name": "string"
}
```
