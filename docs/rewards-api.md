# Rewards API

> **Source:** `views/rewards/`  
> **Modules:** `index.mjs`, `quests.mjs`, `userQuests.mjs`, `userRewards.mjs`  
> **Base URL:** `/v1`

## Overview

The Rewards API manages the quest and rewards systems, tracking available quests, the rewards associated with them, and the user's progress and earned rewards.

---

## Rewards API

> **Source:** `views/rewards/index.mjs`
> **Base URL:** `/v1/rewards`

### Get Rewards

```http
GET /v1/rewards
```
Fetches rewards based on query parameters. Requires authentication.

### Create/Update Reward

```http
POST /v1/rewards
```
Creates or updates a reward object. Requires authentication.

**Request Body (multipart/form-data):**
```json
{
  "fields": {
    "cookie": "string",
    "name": "string",
    "description": "string",
    "start_date": "string",
    "end_date": "string"
  },
  "files": {
    "image": "file_binary"
  }
}
```

### List Rewards

```http
GET /v1/rewards/list
```
Lists available rewards. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get Reward By ID

```http
GET /v1/rewards/:reward_id
```
Fetches a specific reward by its ID. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `reward_id` | `string` | ID of the reward |

---

## Quests API

> **Source:** `views/rewards/quests.mjs`
> **Base URL:** `/v1/rewards/quests`

### Create/Update Quest

```http
POST /v1/rewards/quests
```
Creates or updates a quest. Requires authentication.

**Request Body (multipart/form-data):**
```json
{
  "fields": {
    "name": "string",
    "description": "string",
    "points": 100,
    "link_url": "https://example.com",
    "link_option": true,
    "file_upload_option": true,
    "end_date": "2026-12-31"
  },
  "files": {
    "image": "file_binary"
  }
}
```

### List Quests

```http
GET /v1/rewards/quests/list
```
Lists available quests. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get Quest By ID

```http
GET /v1/rewards/quests/:quest_id
```
Fetches a specific quest by its ID. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `quest_id` | `string` | ID of the quest |

---

## User Rewards API

> **Source:** `views/rewards/userRewards.mjs`
> **Base URL:** `/v1/rewards/user`

### Create/Update User Reward

```http
POST /v1/rewards/user
```
Creates or updates a record indicating a reward earned by a user. Requires authentication.

**Request Body:**
```json
{
  "reward_id": "string"
}
```

### List User Rewards

```http
GET /v1/rewards/user/list
```
Lists rewards earned by the authenticated user. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Filter by status |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get All User Rewards

```http
GET /v1/rewards/user/user/all
```
Fetches all user reward history for the authenticated user. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get User Reward By ID

```http
GET /v1/rewards/user/:user_reward_id
```
Fetches a specific user reward record by its ID. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `user_reward_id` | `string` | ID of the user reward |

---

## User Quests API

> **Source:** `views/rewards/userQuests.mjs`
> **Base URL:** `/v1/rewards/quests/user`

### Create/Update User Quest

```http
POST /v1/rewards/quests/user
```
Creates or updates a record tracking a user's progress on a quest. Requires authentication.

**Request Body (multipart/form-data):**
```json
{
  "fields": {
    "quest_id": 1,
    "url": "https://example.com"
  },
  "files": {
    "image": "file_binary"
  }
}
```

### Change Quest Status

```http
POST /v1/rewards/quests/user/change_status
```
Changes the status of a user's quest (e.g. from in-progress to completed). Requires authentication.

**Request Body:**
```json
{
  "user_quest_id": "string",
  "status": "string"
}
```

### List User Quests

```http
GET /v1/rewards/quests/user/list
```
Lists quests associated with the authenticated user. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Filter by status |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get All User Quests

```http
GET /v1/rewards/quests/user/all
```
Fetches all user quest history for the authenticated user. Requires authentication.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | `string` | Filter by status |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Item limit (default: 10) |

### Get User Quest By ID

```http
GET /v1/rewards/quests/user/:quest_id
```
Fetches a specific user quest record by its ID. Requires authentication.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `quest_id` | `string` | ID of the user quest |
