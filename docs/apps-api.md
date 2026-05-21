# Apps API

> **Source:** `views/apps/`  
> **Modules:** `authApp.mjs`  
> **Base URL:** `/v1/apps`

## Overview

The Apps API provides endpoints to generate and verify secure API keys for third-party application access. It utilizes AES-256-CBC encryption and bcrypt hashing to manage API keys associated with authenticated users.

---

## Endpoints

### Generate API Key

```http
POST /v1/apps/generate_api_key
```

Generates a new API key for an application, encrypting the user ID into the key and storing its hashed version in the database.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie (handled by `mustBeAuthenticated` middleware) |

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

**Response (200 OK):**
```json
{
  "api_key": "generated_base64url_string",
  "name": "App Name"
}
```

---

### Verify API Key

```http
GET /v1/apps/verify
```

Verifies the provided API key by decrypting it to extract the associated user ID and cross-referencing it with the database.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `x-api-key` | `string` | Yes | The API key to verify |

**Response (200 OK):**
```json
{
  "api_key": "string",
  "name": "string"
}
```
