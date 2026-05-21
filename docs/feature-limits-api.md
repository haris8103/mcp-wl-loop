# Feature Limits API

> **Source:** `views/feature_limits/`  
> **Modules:** `feature_limits.mjs`  
> **Base URL:** `/v1/feature_limits`

## Overview

The Feature Limits API provides a middleware-protected endpoint to retrieve the capability limits configured for the authenticated user's current subscription plan.

---

## Endpoints

### Get Feature Limits

```http
GET /v1/feature_limits
```

Fetches the limits assigned to the authenticated user's plan.

**Headers:**
| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `cookie` | `string` | Yes | Authentication cookie (handled by `mustBeAuthenticated` middleware) |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "plan_id": 3,
    "fans_per_collection": 500,
    "fans_across_all_collections": 5000,
    "launchpads_limit": 5,
    "active_collections_limit": 5,
    "storage_limit_gb": 10
  }
]
```
