# Umami Analytics API

> **Source:** `views/umami/routes.mjs`  
> **Base URL:** `/v1/umami`

## Overview

The Umami Analytics API provides endpoints for fetching website analytics data from Umami. Includes dashboard stats, pageview graphs, fan growth data, collection performance, customer counts, and artist revenue.

---

## Endpoints

### Get Stats by Range

```
GET /v1/umami/stats/range
```

Fetches website stats and pageviews for a given time range.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `host` | `string` | Yes | Domain/hostname to filter (e.g., `artist.loop.fans`) |
| `range` | `string` | No | Time range: `1h`, `24h`, `7d`, `30d`, `90d` (default: `24h`) |
| `unit` | `string` | No | Time unit for data points (default: `hour`) |
| `timezone` | `string` | No | Timezone (default: `America/New_York`) |
| `compare` | `string` | No | Enable comparison (default: `false`) |

**Response:**
```json
{
  "success": true,
  "websiteView": { "pageviews": [], "sessions": [] },
  "data": { "pageviews": {}, "visitors": {}, "visits": {} },
  "metadata": {
    "websiteId": "string",
    "range": "string",
    "startAt": "number",
    "endAt": "number"
  }
}
```

---

### Get Graph Stats by Range

```
POST /v1/umami/graph/stats/range
```

Fetches detailed graph data for dashboard with pageview trends, daily averages, and period comparison.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` and `profile_id` |
| `range` | `string` | Yes | Time range: `1h`, `24h`, `7d`, `30d`, `90d` |
| `host` | `string` | No | Domain (auto-fetched from user domain if omitted) |
| `unit` | `string` | No | Time unit (default: `hour`) |
| `timezone` | `string` | No | Timezone (default: `Asia/Karachi`) |
| `device` | `string` | No | Device filter (default: `all`) |

**Response:**
```json
{
  "averageDailyViewsPercentage": {
    "absoluteChange": "number",
    "percentChange": "number"
  },
  "success": true,
  "viewsGraphs": [{ "x": "date_string", "y": "number" }],
  "pageviewsMonthly": {},
  "pageviewsWeekly": {},
  "averageDailyViews": "string",
  "metadata": { "range": "string", "host": "string" }
}
```

**Notes:**
- Compares current period with previous period for percentage change
- Fills in zero values for missing time slots
- Gets user creation date for lifetime views
- Fetches monthly and weekly stats summaries

---

### Get Fans Growth Graph

```
POST /v1/umami/graph/fansGrowth
```

Fetches fan/follower growth data over the last 6 months with month-over-month change.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |
| `collectionFilter` | `string` | No | Optional filter |

**Response:**
```json
{
  "currentMonthNewFans": "number",
  "followerMonthlyGrowthData": [
    { "month": "Jan", "year": "2025", "newFollowers": "number" }
  ],
  "pctChangeMoM": "number",
  "followers": [
    { "id": "string", "display_name": "string", "date_created": "date" }
  ]
}
```

---

### Get Collection Graph

```
POST /v1/umami/graph/collections
```

Fetches collection performance data including NFT supply completion percentages.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |
| `collectionFilter` | `string` | No | Sort: `all`, `top`, `recent` (default: sorted by completion %) |

**Response:**
```json
{
  "collectionDetails": [
    {
      "fanCollectionName": "string",
      "id": "string",
      "collectionId": "string",
      "maxSupply": "number",
      "nftOwnerCount": "number",
      "completionPercentage": "string",
      "mintPrice": "string",
      "publicDate": "string"
    }
  ],
  "overallCompletionPercentage": "string"
}
```

---

### Get Dashboard Summary

```
POST /v1/umami/dashboard
```

Fetches dashboard summary — total NFTs, monthly page view percentage change, and current month stats.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |
| `host` | `string` | No | Domain (auto-fetched if omitted) |

**Response:**
```json
{
  "monthlyPercentChange": "number",
  "pageviewsTwoMonth": {},
  "nft_count": "number"
}
```

---

### Get Fans Following

```
POST /v1/umami/fans
```

Fetches detailed follower list with this-month and last-month fan counts.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |

**Response:**
```json
{
  "fans_following": [
    { "id": "string", "first_name": "string", "last_name": "string", "date_created": "date" }
  ],
  "totalFans": "number",
  "lastMonthFans": "number",
  "thiMonthFans": "number"
}
```

---

### Get Active Customers

```
POST /v1/umami/customers
```

Fetches the count of unique NFT owners across all of the artist's collections.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |

**Response:**
```json
{
  "UniqueOwners": "number"
}
```

---

### Get Artist Revenue

```
POST /v1/umami/revenue
```

Fetches total revenue from approved payments for the artist's launchpads.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userInfo` | `object` | Yes | User info with `id` |

**Response:**
```json
{
  "userTotalRevenue": "number"
}
```
