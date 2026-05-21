# Admin API

> **Source:** `views/admin/`  
> **Modules:** `adminActions.mjs`  
> **Base URL:** `/v1/admin/action`

## Overview

The Admin API provides privileged operations for updating core platform models, such as marking users or collections as "featured". These endpoints verify that the authenticated user possesses the `Admin` role.

---

## Endpoints

### Update Collection

```http
POST /v1/admin/action/update_collection/:id
```

Updates a specific field for a given collection (launchpad). Currently restricted to updating the `featured` field.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The ID of the launchpad/collection to update |

**Request Body:**
```json
{
  "cookie": "string",
  "field_name": "featured",
  "field_value": true
}
```

**Response (200 OK):**
```text
Success
```

**Response (400 Bad Request):**
```text
Invalid
```

---

### Update User

```http
POST /v1/admin/action/update_user/:id
```

Updates a specific field for a given user profile. Currently restricted to updating the `featured` field.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The UUID of the user to update |

**Request Body:**
```json
{
  "cookie": "string",
  "field_name": "featured",
  "field_value": true
}
```

**Response (200 OK):**
```text
Success
```

**Response (400 Bad Request):**
```text
Invalid
```
