# Rewards API

> **Source:** `views/rewards/`  
> **Modules:** `quests.mjs`, `userQuests.mjs`, `userRewards.mjs`  
> **Base URL:** `/v1/rewards`

## Overview

The Rewards API manages a quest-and-rewards system where users can complete quests (tasks) to earn XP, points, and other rewards. Quests can be daily, weekly, or one-time, and are categorized by type (social, engagement, etc.).

---

## Quests API

> **Source:** `views/rewards/quests.mjs`

### Get All Available Quests

```
GET /v1/rewards/quests
```

Fetches all available quests.

**Response:**
```json
{
  "quests": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "xp_reward": "number",
      "quest_type": "string",
      "frequency": "string",
      "is_active": "boolean"
    }
  ]
}
```

---

### Get Quest by ID

```
GET /v1/rewards/quests/:id
```

Fetches a specific quest by its ID.

---

### Get Quests by Type

```
GET /v1/rewards/quests/type/:type
```

Fetches quests filtered by type (e.g., `social`, `engagement`, `daily`).

---

## User Quests API

> **Source:** `views/rewards/userQuests.mjs`

### Get User's Quest Status

```
POST /v1/rewards/user/quests
```

Fetches all quest statuses for the authenticated user (completed, in-progress, available).

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

**Response:**
```json
{
  "quests": [
    {
      "quest_id": "string",
      "status": "string",
      "progress": "number",
      "completed_at": "string"
    }
  ]
}
```

---

### Complete a Quest

```
POST /v1/rewards/user/quests/complete
```

Marks a quest as completed for the user and awards XP/rewards. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `quest_id` | `string` | Yes | Quest ID to complete |

**Validations:**
- Quest must exist and be active
- Quest must not already be completed (for one-time quests)
- Daily/weekly quests check time-based reset

---

### Update Quest Progress

```
POST /v1/rewards/user/quests/progress
```

Updates progress on a quest (e.g., incrementing a counter). Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `quest_id` | `string` | Yes | Quest ID |
| `progress` | `number` | Yes | Progress increment value |

---

## User Rewards API

> **Source:** `views/rewards/userRewards.mjs`

### Get User Rewards

```
POST /v1/rewards/user
```

Fetches reward balance and history for the authenticated user.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

**Response:**
```json
{
  "total_xp": "number",
  "level": "number",
  "rewards": [
    {
      "id": "string",
      "type": "string",
      "amount": "number",
      "date_earned": "string",
      "source": "string"
    }
  ]
}
```

---

### Get Reward Leaderboard

```
GET /v1/rewards/leaderboard/:page/:limit
```

Fetches a paginated leaderboard of top users by XP/rewards.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number |
| `limit` | `number` | Items per page |
