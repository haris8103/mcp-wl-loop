# Users API

> **Source:** `views/users/`  
> **Modules:** `user/userActions.mjs`, `user/userProfile.mjs`, `user/auth/index.mjs`, `merchant/index.mjs`  
> **Base URL:** `/v1/user`

## Overview

The Users API manages user profile updates, social interactions (following), wallet balances, payout requests, and merchant events.

---

## Auth & Info API

> **Source:** `views/users/user/auth/index.mjs`

### User Info

```http
POST /v1/user/userInfo
```
Gets or creates user info based on the provided wallet address and cookie.

**Request Body:**
```json
{
  "cookie": "string",
  "address": "string"
}
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `platform` | `string` | Platform identifier |

### Following IDs

```http
POST /v1/user/followingIds
```
Fetches an array of user IDs that the authenticated user is currently following.

**Request Body:**
```json
{
  "cookie": "string",
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  }
}
```

### Follow Count

```http
POST /v1/user/followCount
```
Fetches the follower and following counts for the user.

**Request Body:**
```json
{
  "userId": "string"
}
```

### Following List

```http
POST /v1/user/followingList
```
Fetches the detailed list of users that the authenticated user follows.

**Request Body:**
```json
{
  "userId": "string",
  "limit": 0,
  "page": 0
}
```

### Follower List

```http
POST /v1/user/followerList
```
Fetches the detailed list of followers for the authenticated user.

**Request Body:**
```json
{
  "userId": "string",
  "limit": 0,
  "page": 0
}
```

### User Wallets

```http
POST /v1/user/user-wallets
```
Fetches the wallet addresses associated with the user account.

**Request Body:**
```json
{
  "cookie": "string"
}
```

---

## User Actions API

> **Source:** `views/users/user/userActions.mjs`

### Create Post

```http
POST /v1/user/action/post
```
Creates a new post by the user.

**Request Body (multipart/form-data):**
```json
{
  "fields": {
    "cookie": "string",
    "user_id": "string",
    "profile_id": "string",
    "post_content": "string",
    "post_visibility": "public",
    "post_FileType": "image",
    "wall_user": "string"
  },
  "files": {
    "image": "file_binary",
    "song": "file_binary"
  }
}
```

### Check If Following

```http
POST /v1/user/action/isFollowing
```
Checks if the authenticated user is following a specific user.

**Request Body:**
```json
{
  "cookie": "string",
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  },
  "id": "string"
}
```

### Follow / Unfollow

```http
POST /v1/user/action/follow
```
Toggles the follow status for another user.

**Request Body:**
```json
{
  "cookie": "string",
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  },
  "follower_id": "string"
}
```

### Update Field

```http
POST /v1/user/action/update_field/:id
```
Updates a specific field of the user profile by ID.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The name of the field to update (e.g., `about`, `music`) |

**Request Body:**
```json
{
  "cookie": "string",
  "about": "string"
}
```

### Update Profile

```http
POST /v1/user/action/update_profile
```
Updates multiple profile fields at once for the authenticated user.

**Request Body (multipart/form-data):**
```json
{
  "fields": {
    "cookie": "string",
    "user_id": "string",
    "profile_id": "string",
    "profile_displayName": "string",
    "profile_description": "string",
    "profile_about": "string",
    "profile_username": "string",
    "profile_socials": "[{\"name\":\"twitter\",\"value\":\"username\"}]",
    "profile_show_featured_song": true,
    "profile_location": "string",
    "profile_onboard": true,
    "profile_type": "string"
  },
  "files": {
    "profile_avatar": "file_binary",
    "profile_background": "file_binary",
    "profile_featured_song": "file_binary"
  }
}
```

### Update Genres

```http
POST /v1/user/action/update_genres
```
Updates the favorite genres of the user.

**Request Body:**
```json
{
  "cookie": "string",
  "genresIds": [],
  "profile_id": "string"
}
```

### Add Favorite

```http
POST /v1/user/action/add_fav
```
Adds an item to the user's favorites list.

**Request Body:**
```json
{
  "address": "string",
  "platform": "string",
  "type": "string",
  "id": "string"
}
```

### Get Account Balance

```http
POST /v1/user/action/account/balance
```
Fetches the user's account balance.

**Request Body:**
```json
{
  "cookie": "string"
}
```

### Payout History

```http
POST /v1/user/action/payout/history
```
Fetches the history of payout requests for the user.

**Request Body:**
```json
{
  "cookie": "string"
}
```

### Request Payout

```http
POST /v1/user/action/payout/request
```
Submits a new payout request for the user's balance.

**Request Body:**
```json
{
  "cookie": "string",
  "amount": 0,
  "platform": "string",
  "payout_email": "string",
  "full_name": "string",
  "whatsapp": "string"
}
```

### Check Account

```http
POST /v1/user/action/checkAccount
```
Checks the status or validity of the user's account.

**Request Body:**
```json
{
  "email": "string"
}
```

### Send Payout Email

```http
POST /v1/user/action/sendPayoutEmail
```
Sends a notification email regarding a payout.

**Request Body:**
```json
{
  "cookie": "string"
}
```

### Send Form Email

```http
POST /v1/user/action/sendFormEmail
```
Sends an email related to a form submission by the user.

**Request Body:**
```json
{
  "cookie": "string",
  "subject": "string",
  "message": "string"
}
```

---

## User Profile API

> **Source:** `views/users/user/userProfile.mjs`  
> **Base URL:** `/v1/user/update`

### Update WhatsApp

```http
POST /v1/user/update/whatsapp
```
Updates the WhatsApp contact number for the user's profile.

**Request Body:**
```json
{
  "cookie": "string",
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  },
  "whatsapp": "string"
}
```

---

## Merchant API

> **Source:** `views/users/merchant/index.mjs`  
> **Base URL:** `/v1/merchant`

### Merchant Events

```http
POST /v1/merchant/events
```
Retrieves or processes merchant-related events for users with the merchant role.

**Request Body:**
```json
{
  "cookie": "string",
  "userInfo": {
    "id": "uuid",
    "role": "artist",
    "profile_id": "uuid",
    "avatar": "file_uuid",
    "first_name": "string",
    "display_name": "string",
    "username": "string",
    "onboard": true,
    "wallet_address": "string"
  }
}
```