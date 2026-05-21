# Scripts API

> **Source:** `views/scripts/`  
> **Modules:** `code_generator/code_generator.mjs`  
> **Base URL:** `/v1/scripts`

## Overview

The Scripts API houses miscellaneous utility endpoints and automated scripting triggers, such as generating codes for user invitations or token redemption.

---

## Endpoints

### Generate Code

```http
POST /v1/scripts/codeGen
```

Generates unique codes (e.g., invite codes, discount codes, or redemption tokens).

**Request Body:**
```json
{
  "collectionId": "string",
  "numberOfCodes": 10
}
```

**Response (200 OK):**
```json
{
  "numberOfCodes": 10,
  "codes": [
    "collectionId-0123456",
    "collectionId-6543210"
  ]
}
```
