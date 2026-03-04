# Loop MCP Server

An **MCP (Model Context Protocol) Server** that provides comprehensive API documentation for the **Loopfans Rewards API**. This server exposes the API documentation as MCP Resources, allowing LLMs and MCP clients to directly access structured information about endpoints, authentication, and usage patterns.

## Features

- **Protocol**: Server-Sent Events (SSE) via Express authentication.
- **Port**: Defaults to `3001`.
- **Resources**: Serves markdown-based API documentation.
- **Stack**: TypeScript, Express, @modelcontextprotocol/sdk.

## Prerequisites

- **Node.js**: v18 or higher.
- **Yarn**: Package manager.

## Installation

```bash
yarn install
```

## Running the Server

### Development
To run in development mode with hot-reloading:

```bash
yarn dev
```
The server will start at `http://localhost:3001`.

### Production Build
To build and run the production version:

```bash
yarn build
yarn start
```

## connecting to the Server

This server uses the **SSE (Server-Sent Events)** transport.

- **SSE Endpoint**: `http://localhost:3001/sse`
- **Message Endpoint**: `http://localhost:3001/message`

To connect an MCP client (like an inspector or a compliant LLM interface), point it to the SSE endpoint:
`http://localhost:3001/sse`

## Available Resources

The server exposes the following resources under the `loopfans://` scheme:

### Rewards & Quests System (Original MCP Resources)

| Resource Name | URI | Description |
|---|---|---|
| **API Overview** | `loopfans://api/overview` | General overview, Base URL, and Authentication setup. |
| **Quests API** | `loopfans://api/quests` | Endpoints for creating and managing quests (Admin). |
| **User Quests API** | `loopfans://api/user-quests` | Endpoints for user quest submissions. |
| **Rewards API** | `loopfans://api/rewards` | Endpoints for creating and managing rewards (Admin). |
| **User Rewards API** | `loopfans://api/user-rewards` | Endpoints for user reward redemption. |
| **Authentication Guide** | `loopfans://api/auth` | Detailed guide on obtaining and using JWT cookies. |
| **Usage Examples** | `loopfans://api/examples` | Workflow examples (e.g., Create Quest -> Submit -> Approve). |
| **Complete API Reference** | `loopfans://api/reference` | A consolidated list of all available endpoints. |

### Comprehensive Backend API Resources (New)

| Resource Name | URI | Description |
|---|---|---|
| **Backend API Reference** | `loopfans://api/backend-reference` | **Master API Reference** - Complete documentation for all 200+ backend endpoints including rewards, quests, users, admin, fans, payments, collections, arena, billing, music library, white label, templates, files, and utilities. |
| **Fans & Creators API** | `loopfans://api/fans` | Detailed API documentation for creator profiles, fan interactions, launchpad projects, social features, and NFT operations. |
| **Collections API** | `loopfans://api/collections` | NFT collection management API including creation, deployment, and querying. |

### Complete Backend API Documentation

Comprehensive documentation for all backend middleware APIs is available in the `docs/` directory:

| Documentation File | Description |
|---|---|
| **[backend-api-reference.md](./docs/backend-api-reference.md)** | **Master API Reference** - Complete documentation for all 200+ backend endpoints including rewards, quests, users, admin, fans, payments, collections, arena, billing, music library, white label, templates, files, and utilities. |
| **[fans-api.md](./docs/fans-api.md)** | **Fans & Creators API** - Detailed documentation for creator profiles, fan interactions, launchpad projects, social features, and NFT operations. |
| **[collections-api.md](./docs/collections-api.md)** | **Collections API** - NFT collection management including creation, deployment, and querying. |
| **[quests-api.md](./docs/quests-api.md)** | Quest management endpoints (Admin). |
| **[user-quests-api.md](./docs/user-quests-api.md)** | User quest submission endpoints. |
| **[rewards-api.md](./docs/rewards-api.md)** | Reward management endpoints (Admin). |
| **[user-rewards-api.md](./docs/user-rewards-api.md)** | User reward redemption endpoints. |
| **[api-overview.md](./docs/api-overview.md)** | API overview and authentication. |
| **[usage-examples.md](./docs/usage-examples.md)** | Usage examples and workflows. |
| **[complete-reference.md](./docs/complete-reference.md)** | Complete endpoint reference. |

### API Categories

The backend API is organized into the following categories:

- **Core APIs**: Rewards, Quests, Users, Admin
- **Content & Collections**: Fans, Collections, Launchpad, Arena, Music Library
- **Commerce & Payments**: Payments, Billing
- **Platform Features**: Files, Templates, White Label, Scripts, Umami
- **Utilities**: Currency, Common helpers

## Development

The main logic is located in `src/index.ts`. The documentation content is embedded within the resource registration in `src/index.ts` and also mirrored in the `docs/` directory for reference.
