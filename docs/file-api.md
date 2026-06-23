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
```json
{
  "files.file": "file_binary"
}
```

**Validation:**
- **Max File Size:** 10MB
- **Allowed Types:** `jpeg`, `jpg`, `png`, `gif`, `pdf`, `doc`, `docx`

**Response:**
```json
"file_uuid"
```

**Frontend contract:** `Fans_Studio` sends the multipart field as `file` and consumes the upload response as the file ID directly. Some paths use `axios` and read `uploadResponse.data`; others use `fetch` and read `response.text()`.

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
```json
{
  "cookie": "string",
  "file_id": "string",
  "file_name": "string"
}
```

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
