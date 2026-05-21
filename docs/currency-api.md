# Currency API

> **Source:** `views/currency/`  
> **Modules:** `index.mjs`  
> **Base URL:** `/v1/currency`

## Overview

The Currency API provides real-time conversion rates for supported fiat and cryptocurrencies.

---

## Endpoints

### Get Conversion Rate

```http
GET /v1/currency/rate/:code
```

Fetches the exchange rate for a given currency code (e.g., `USD`, `ETH`, `STRK`).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `code` | `string` | The currency code to fetch the rate for |

**Response (200 OK):**
```json
{
  "base_currency": "USD",
  "code": "ETH",
  "value": 1234.56
}
```
