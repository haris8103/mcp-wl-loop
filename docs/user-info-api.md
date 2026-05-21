# User Info API

This document provides detailed documentation for the User Info API endpoints.

## Base URL

All endpoints are prefixed with `/v1/user`

## Endpoints

### UserInfo

#### POST User Info

**POST** `/v1/user/userInfo`

Get/create user info.

**Authentication:** required

**URL Parameters:**
- `platform` (string): Platform name (studio for artist and null for fans)

**Request:**
```json
{
    "address": "0x589489",
    "cookie": "cookie"
}
```

**Response:**
```json
[
	{
		"id": "260b7986-8c2e-4c5a-8211-f0c5ee196488",
		"role": "21052289-c845-44bf-8be0-2bc9ea7cbc1f",
		"profile_id": "107395583888953424964",
		"avatar": false,
		"email": "example@gmail.com",
		"first_name": "example",
		"display_name": null,
		"username": null,
		"onboard": false,
		"wallet_address": "0x589489",
		"wallet": {
			"tokens": 0,
			"value": 0
		},
		"wallets": {
			"loop": {
				"address": "loop1m5ps",
				"pubKey": null
			},
			"starknet": {
				"address": "0x589489",
				"pubKey": "0x70db39"
			}
		}
	}
]
```

**Notes:**
- cookie and wallet address will be get browser cookie storage
- if the user is not exists then create new user
- if user exist then it will provide user data
- To interact all other apis it is needed to be called for getting the user id
