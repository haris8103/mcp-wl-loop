# Loop White Label Middleware API Documentation

This document provides deep details of the API requests and responses handled by the `loop_wl_middleware` service. The service acts as a proxy and caching layer in front of a Directus backend, specifically handling domain validation, authentication, and customized query filtering based on the request origin.

## Base URL
All endpoints are relative to the `/api` route.
Example: `https://<middleware-domain>/api`

## Core Concepts

### 1. Domain Validation Middleware
Every request to the `/api` route must include a valid `Origin` header.
- The middleware extracts the domain from the `Origin` header.
- It queries the Directus `domains` collection to find an active domain matching `domain` or `custom_domain`.
- It fetches the `domainConfig` from Directus on every request (caching is currently commented out/disabled in `domainValidator.js`) and attaches it to the request (`req.domainConfig`).
- It injects default `settings` (theme, colors) if none are provided.
- Required field in `domainConfig`: `owner_id` (used extensively in filtering proxy routes).

### 2. Authentication Middleware
Authentication is conditionally required for specific collections (e.g., `white_label_config`).
- **Header:** `Authorization: Bearer <token>`
- **Validation:** The token is validated via a POST request to `https://cloud.loop.fans/verify-token` sending the token as `cookie`.
- On success, `req.user` is populated.

---

## Endpoint Details

### 1. Get Domain Configuration
Retrieves the white-label configuration for the validated domain.

**Request:**
- **Method:** `GET`
- **Path:** `/api/config`
- **Headers:** 
  - `Origin: <valid-domain>`
  - `Authorization: Bearer <token>`

**Logic:**
- Authenticates the token.
- Queries Directus: `GET /items/white_label_config` with a filter for the current domain.
- Caches the configuration locally.

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "domain": "string",
    "custom_domain": "string",
    "theme": "string",
    "colors": {
      "primary": "string",
      "secondary": "string",
      "accent": "string"
    },
    "logo": {
      "id": "uuid"
    },
    "banner": {
      "id": "uuid"
    },
    "socials": {
      "twitter": "string",
      "instagram": "string",
      "website": "string"
    },
    "seo": {
      "title": "string",
      "description": "string",
      "favicon": {
        "id": "uuid"
      }
    }
  }
}
```

**Response (Error - 404 Not Found):**
```json
{
  "error": {
    "message": "Configuration not found",
    "status": 404
  }
}
```

---

### 2. Directus Proxy Route
Proxies requests dynamically to the Directus API with built-in access control and specialized filtering.

**Request:**
- **Method:** `ALL` (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)
- **Path:** `/api/:collection/*` (where `*` is the specific `item` or path)
- **Headers:** 
  - `Origin: <valid-domain>`
  - `Authorization: Bearer <token>` (Required only if `:collection` is in `['white_label_config']`)
- **Query Parameters:** Any Directus query parameters (e.g., `filter`, `fields`, `sort`).
- **Body:** JSON payload (for `POST`, `PUT`, `PATCH`).

**Access Control Logic:**
- Checks `req.domainConfig.collection_access`.
- If the `item` (path param) is not in the `collection_access` array and is not `fan_funnel`, access is forbidden.

**Special Item Filtering:**

The proxy intercepts specific `item` requests and applies predefined filters/transformations:

#### A. `fans_launchpad_free`
- **Target:** Mapped to the `fans_launchpad` collection.
- **Filters Applied Automatically:**
  - `artist.id` = `req.domainConfig.owner_id`
  - `status` = `"published"`
  - `minPrice` **AND** `mintPrice` must both be `0`, `"0"`, `""`, or `null`.
- **Sort:** `-date_created`

#### B. `fans_launchpad`
- **Target:** `fans_launchpad` collection.
- **Filters Applied Automatically:**
  - `artist.id` = `req.domainConfig.owner_id`
  - `status` = `"published"`
  - `minPrice` or `mintPrice` must **NOT** be `0`, `"0"`, `""`, or `null`.
- **Sort:** `-date_created`

#### C. `fan_funnel`
- **Logic:** Intercepts the REST request and instead makes a `POST /graphql` request to Directus.
- **Query Execution:**
  ```graphql
  query {
    fan_funnel(filter:{ artist: { id: {_eq: "<owner_id>"}}}){
      id
      label
      artist { id }
      items(filter: { item__pre_registration: { is_default: { _eq: true}}}) {
        id
        collection
        item {
          ... on pre_registration {
            id, name, quantity, description, cover_image { id, title },
            release_date, required_tags, is_default
          }
        }
      }
    }
  }
  ```
- **Response:** The native GraphQL response format.

#### D. Content Blocks (`content_blocks`)
- **Filters Applied:**
  - Domain matching (`domain.domain` or `domain.custom_domain` equals requested domain).
  - `fields` = `*,blocks.*.*.*.*,domain.domain`

#### E. White Label Events (`wl_events`)
- **Filters Applied:**
  - Domain matching.
  - `fields` = `*.*`
  - `deep[event_items][_sort]` = `date`

#### F. Configuration and Domains (`white_label_config`, `domains`)
- **Filters Applied:** Matches the validated domain against the `domain` or `custom_domain` fields.

**Generic Filtering Logic:**
If none of the above specific `item` names match, AND user provided query parameters (e.g., `?limit=10`), the middleware appends a domain security filter:
```javascript
filter: { ...userFilter, _or: [{ domain: { _eq: domain } }, { custom_domain: { _eq: domain } }] }
```
If no query parameters are provided, it simply adds `?fields=*.*.*` to the target URL.

> **CRITICAL BEHAVIOR / BUG:** Because of how `options.params` logic is structured, if a client passes **any** query parameters in the request (e.g. `?limit=10`), it entirely skips the predefined security filters for `fans_launchpad`, `content_blocks`, and `wl_events`. The user's query parameters override the hardcoded `artist.id` and pricing filters, applying *only* the domain security filter.

**Response:**
The exact status code and JSON payload received from the Directus API, or standard error objects if the proxy/validation fails.

**Response (Error - 403 Forbidden):**
```json
{
  "success": false,
  "error": "Access to this collection item is not allowed"
}
```

---

## Error Handling
Directus API errors are caught and parsed by a central error handler:
- If Directus returns `error.response.data.errors`, it extracts the first error message.
- If Directus returns a standard message or string, it uses that.
- Uses `express` custom error handling to format all errors uniformly.
