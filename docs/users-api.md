# Users API

> **Source:** `views/users/`  
> **Modules:** `auth.mjs`, `actions.mjs`, `profile.mjs`, `account.mjs`  
> **Base URL:** `/v1/users`

## Overview

The Users API manages user authentication, profile management, account settings, and user actions. It integrates with Directus for user data, Brevo for email campaigns, and Mixpanel for analytics.

---

## Authentication API

> **Source:** `views/users/auth.mjs`

### Register

```
POST /v1/users/register
```

Registers a new user account.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password (min 8 chars) |
| `first_name` | `string` | Yes | First name |
| `last_name` | `string` | No | Last name |

**Side Effects:**
- Creates user in Directus
- Creates Brevo contact
- Generates default wallet/address
- Tracks Mixpanel registration event

**Response:**
```json
{
  "success": true,
  "token": "string",
  "user": { "id": "string", "email": "string" }
}
```

---

### Login

```
POST /v1/users/login
```

Authenticates a user and returns a session token.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Email address |
| `password` | `string` | Yes | Password |

**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires": "number"
}
```

---

### Refresh Token

```
POST /v1/users/refresh
```

Refreshes an expired access token using a refresh token.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refresh_token` | `string` | Yes | Refresh token from login |

---

### Logout

```
POST /v1/users/logout
```

Logs out the user by invalidating the refresh token.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refresh_token` | `string` | Yes | Refresh token to invalidate |

---

### Forgot Password

```
POST /v1/users/forgot-password
```

Initiates a password reset flow by sending a reset email.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Email address |

---

### Reset Password

```
POST /v1/users/reset-password
```

Resets the user's password using a reset token from email.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | `string` | Yes | Reset token from email |
| `password` | `string` | Yes | New password |

---

### SSO Login

```
POST /v1/users/sso
```

Handles Single Sign-On authentication (Google, Apple, etc.).

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | `string` | Yes | SSO provider (`google`, `apple`) |
| `token` | `string` | Yes | Provider access token |

---

## Profile API

> **Source:** `views/users/profile.mjs`

### Get Profile

```
POST /v1/users/profile
```

Fetches the authenticated user's profile. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |

**Response:** Full user profile with avatar, bio, social links, wallet addresses, and plan info.

---

### Update Profile

```
POST /v1/users/profile/update
```

Updates the user's profile. Requires authentication.

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fields.cookie` | `string` | Yes | Auth cookie |
| `fields.first_name` | `string` | No | First name |
| `fields.last_name` | `string` | No | Last name |
| `fields.display_name` | `string` | No | Display name |
| `fields.username` | `string` | No | Username |
| `fields.bio` | `string` | No | Bio text |
| `fields.social_links` | `string` | No | Social links (JSON) |
| `files.avatar` | `File` | No | Profile avatar |
| `files.cover` | `File` | No | Cover image |
| `files.banner` | `File` | No | Banner image |

**Side Effects:**
- Updates Brevo contact attributes
- Tracks Mixpanel event

---

### Get User by Username

```
GET /v1/users/profile/:username
```

Fetches a public user profile by username.

---

## Account API

> **Source:** `views/users/account.mjs`

### Get Account Settings

```
POST /v1/users/account
```

Fetches the user's account settings (email, plan, wallet). Requires authentication.

---

### Update Account Email

```
POST /v1/users/account/email
```

Updates the user's email address. Requires authentication and password verification.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `new_email` | `string` | Yes | New email address |
| `password` | `string` | Yes | Current password for verification |

---

### Change Password

```
POST /v1/users/account/password
```

Changes the user's password. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `current_password` | `string` | Yes | Current password |
| `new_password` | `string` | Yes | New password |

---

### Delete Account

```
POST /v1/users/account/delete
```

Permanently deletes the user's account. Requires authentication and password verification.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `password` | `string` | Yes | Current password |

---

## User Actions API

> **Source:** `views/users/actions.mjs`

### Get User Notifications

```
POST /v1/users/notifications
```

Fetches notifications for the authenticated user. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `page` | `number` | No | Page number |
| `limit` | `number` | No | Items per page |

---

### Mark Notification as Read

```
POST /v1/users/notifications/read
```

Marks one or more notifications as read. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
| `notification_ids` | `string[]` | Yes | Array of notification IDs |

---

### Get User's Wallet Info

```
POST /v1/users/wallet
```

Fetches wallet addresses and balances for the authenticated user. Requires authentication.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookie` | `string` | Yes | Auth cookie |
