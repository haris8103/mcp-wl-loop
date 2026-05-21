# Common API

> **Source:** `views/common/`  
> **Modules:** `common.routes.mjs`  
> **Base URL:** `/v1`

## Overview

The Common API provides shared platform-level endpoints, such as platform FAQs, menu settings, authentication checks, and cache management.

---

## Endpoints

### Default Route

```http
GET /v1/
```

Health check endpoint. Returns a simple `"Hello, world"` message.

**Response (200 OK):**
```
Hello, world
```

---

### Check Authentication

```http
POST /v1/checkAuth
```

Checks if a given user cookie is valid and authenticated.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `usercookie` | `string` | Yes | The user's authentication cookie |

**Request Body:** None

**Response (200 OK):**
```json
{ "message": "User is authenticated" }
```

**Response (401 Unauthorized):**
```json
{ "message": "User is not authenticated" }
```

---

### Platform FAQs

```http
GET /v1/faqs/:platform
```

Fetches the frequently asked questions (FAQs) for a specific platform.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `platform` | `string` | The platform name (e.g., `studio`, `marketplace`) |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "question": "string",
    "answer": "string"
  }
]
```

---

### Platform Menu

```http
GET /v1/platform_menu
```

Fetches the platform menu settings. Results are heavily cached via an in-memory cache to reduce database load.

**Response (200 OK):** 
```json
[
  {
    "id": 1,
    "title": "Home",
    "url": "/home",
    "icon": "home-icon"
  }
]
```

---

### Clear Cache

```http
POST /clear-cache
```

Webhook endpoint used to clear the in-memory cache (flushes all keys). Useful for resetting cached menus or rate limits when content is updated from the CMS.

**Response (200 OK):**
```
Cache cleared successfully
```
