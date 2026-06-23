# Templates API

> **Source:** `views/templates/`  
> **Modules:** `routes.mjs`  
> **Base URL:** `/v1/templates`

## Overview

The Templates API provides access to the website templates available for artist whitelabel domains. It supports fetching a paginated, filterable, and sortable list of templates based on subscription plans.

---

## Endpoints

### Get Templates List

```http
GET /v1/templates
```

Fetches a list of published website templates. Supports pagination, sorting, and filtering by name or associated subscription plans.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `number` | No | Page number for pagination (default: 1) |
| `limit` | `number` | No | Number of templates per page (default: 10) |
| `sort` | `string` | No | Field to sort by (e.g., `date_created` or `-date_created`) |
| `filter` | `string` | No | String to filter template names by (case-insensitive) |
| `plans` | `string` | No | Array/list of subscription plan IDs to filter templates by |

**Response (200 OK):**
```json
{
  "website_templates": [
    {
      "id": "1",
      "sort": 1,
      "date_created": "2023-01-01T00:00:00Z",
      "date_updated": "2023-01-01T00:00:00Z",
      "name": "Template Name",
      "description": "Template description",
      "image": {
        "id": "image-uuid",
        "url": "https://..."
      },
      "images": [
        {
          "id": "image-uuid",
          "url": "https://..."
        }
      ],
      "price": 0,
      "category": "string",
      "preview_url": "https://...",
      "subscription_plan": {
        "id": "2",
        "name": "Pro Plan",
        "price_cents": 1000
      },
      "mode": "dark",
      "primary_color": "#ffffff",
      "secondary_color": "#000000",
      "website_template": {
        "id": "1",
        "name": "Template Name"
      }
    }
  ],
  "website_templates_aggregated": [
    {
      "count": {
        "id": 1
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Frontend contract:** `Fans_Studio/src/app/api/templates.api.tsx` consumes the response directly from `response.data`. The payload is not wrapped in an outer `data` object. The frontend validates `website_templates` as an array and falls back to a synthesized `meta` object only if `meta` is missing.

**Validation Details:**
- Query parameters are validated via `validateQueryParams(ctx.query)`.
- If invalid, a `400 Bad Request` with `Validation Error` and the specific detail errors will be returned.
