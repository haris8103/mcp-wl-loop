
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from "dotenv";
import axios from "axios";
import express from "express";
import cors from "cors";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { IncomingHttpHeaders } from "http";
import { randomUUID } from "node:crypto";
import type { Request, Response } from 'express';
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcrypt";

const NWS_API_BASE = "http://localhost:8080";

dotenv.config();

// const transportHeaders = new WeakMap<StreamableHTTPServerTransport, IncomingHttpHeaders>();
// Create server instance
const server = new McpServer({
    name: "loopfans-wl-mcp-server",
    version: "1.0.0",
});



// ============================================================================
// MCP RESOURCES - API DOCUMENTATION
// ============================================================================

// API Overview Resource
server.registerResource(
    "API Overview",
    "loopfans://api/overview",
    {
        description: "Loopfans Rewards API overview and getting started guide",
        mimeType: "text/markdown"
    },
    async () => ({
        contents: [{
            uri: "loopfans://api/overview",
            mimeType: "text/markdown",
            text: `# Loopfans Rewards API Overview
## NOTE
Use yarn to add all dependencies. Do not use npm.

## Base URL
\`http://localhost:8080\`

## Authentication
Sign up and sign in will be done through typescript sdk: @lil2good/cloud-social-wallet (its need to be installed with yarn add @lil2good/cloud-social-wallet) which will return a JWT token and address which will be further be used in all endpoints as a JWT authentication via the \`user_cookie\` header also store the address and cookie from response of cloud wallet sdk. So add/ it in the auth header of all the requests.
Add the sdk in the package.json of the project. And use it to sign up and sign in with the following example.

## Example

import {WalletProvider} from "cloud-social-wallet";

function App() {
    return (
        <WalletProvider config={{rpc: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_10/PJNkurZzzzji8gA6ErLHN', backend_url: 'https://cloud.loop.fans', prefix: 'starknet'}}>
            <WalletApp/>
        </WalletProvider>
    )
}


import {useWallet} from "cloud-social-wallet";

function WalletApp() {
    const {address, cookie, logout, login} = useWallet()
    return (
        <>
            {
                address ? <>
                    <p>{address}</p>
                    <button onClick={logout}>Disconnect</p>
                </> : <>
                    <button onClick={() => login('google')}>Google Login</button>
                     <button onClick={() => login('auth')}>ogin With Email</button>
                </>
            }
        </>
    )
}


## Available Endpoints

### User Info
- to get user info from directus or create if not exists

### Quests Management
- Create, update, list, and retrieve quests
- Quest submission and approval workflowsL

### User Quests
- Submit quest participation
- Update submissions
- Change quest status (approve/reject)
- List user quests

### Rewards Management
- Create and update rewards
- List available rewards
- Get reward details

### User Rewards
- Redeem rewards with points
- List user's redeemed rewards
- Track reward redemption

### Dashboard
- Get comprehensive statistics
- Track quest and reward metrics

## Common Parameters

- **limit**: Number of items per page (default: 10)
- **page**: Page number (default: 1)
- **cookie**: JWT authentication token (required for all endpoints)

## Response Format
All endpoints return JSON responses.

## Error Handling
Errors return JSON with an \`error\` field containing the error message.
`
        }]
    })
);
// ============================================================================
// COMPREHENSIVE BACKEND API DOCUMENTATION RESOURCES
// ============================================================================

// Backend API Reference Resource
server.registerResource(
    "Backend API Reference",
    "loopfans://api/backend-reference",
    {
        description: "Complete backend API reference covering all 200+ endpoints across all categories",
        mimeType: "text/markdown"
    },
    async () => {
        try {
            const content = await fs.promises.readFile(
                "./docs/backend-api-reference.md",
                "utf-8"
            );
            return {
                contents: [{
                    uri: "loopfans://api/backend-reference",
                    mimeType: "text/markdown",
                    text: content
                }]
            };
        } catch (error) {
            console.error("Error reading backend-api-reference.md:", error);
            return {
                contents: [{
                    uri: "loopfans://api/backend-reference",
                    mimeType: "text/markdown",
                    text: "# Error\n\nFailed to load backend API reference documentation."
                }]
            };
        }
    }
);

// User Info API Resource
server.registerResource(
    "User Info API",
    "loopfans://api/user-info",
    {
        description: "Detailed API documentation for user info",
        mimeType: "text/markdown"
    },
    async () => {
        try {
            const content = await fs.promises.readFile(
                "./docs/user-info-api.md",
                "utf-8"
            );
            return {
                contents: [{
                    uri: "loopfans://api/user-info",
                    mimeType: "text/markdown",
                    text: content
                }]
            };
        } catch (error) {
            console.error("Error reading user-info-api.md:", error);
            return {
                contents: [{
                    uri: "loopfans://api/user-info",
                    mimeType: "text/markdown",
                    text: "# Error\n\nFailed to load User Info API documentation."
                }]
            };
        }
    }
);

// Fans & Creators API Resource
server.registerResource(
    "Fans & Creators API",
    "loopfans://api/fans",
    {
        description: "Detailed API documentation for fans, creators, launchpad projects, and social features",
        mimeType: "text/markdown"
    },
    async () => {
        try {
            const content = await fs.promises.readFile(
                "./docs/fans-api.md",
                "utf-8"
            );
            return {
                contents: [{
                    uri: "loopfans://api/fans",
                    mimeType: "text/markdown",
                    text: content
                }]
            };
        } catch (error) {
            console.error("Error reading fans-api.md:", error);
            return {
                contents: [{
                    uri: "loopfans://api/fans",
                    mimeType: "text/markdown",
                    text: "# Error\n\nFailed to load Fans & Creators API documentation."
                }]
            };
        }
    }
);

// Collections API Resource
server.registerResource(
    "Collections API",
    "loopfans://api/collections",
    {
        description: "NFT collection management API documentation",
        mimeType: "text/markdown"
    },
    async () => {
        try {
            const content = await fs.promises.readFile(
                "./docs/collections-api.md",
                "utf-8"
            );
            return {
                contents: [{
                    uri: "loopfans://api/collections",
                    mimeType: "text/markdown",
                    text: content
                }]
            };
        } catch (error) {
            console.error("Error reading collections-api.md:", error);
            return {
                contents: [{
                    uri: "loopfans://api/collections",
                    mimeType: "text/markdown",
                    text: "# Error\n\nFailed to load Collections API documentation."
                }]
            };
        }
    }
);

server.tool(
    "ping",
    "A simple ping tool to verify server connectivity",
    async () => {
        return {
            content: [{ type: "text", text: "pong" }]
        };
    }
);


// ============================================================================
// EXPRESS SERVER SETUP
// ============================================================================
const PORT = 3001;
const app = createMcpExpressApp();
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        token = req.headers.authorization;
    }
    const response = await axios({
        url: `http://localhost:8080/v1/apps/verify`,
        method: "get",
        headers: { "x-api-key": token },
    });
    console.error(response.data)
    if (response.status !== 200) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
const mcpPostHandler = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
                transports[sessionId] = transport;
            },
        });

        transport.onclose = () => {
            if (transport.sessionId) {
                delete transports[transport.sessionId];
            }
        };

        await server.connect(transport);
    } else {
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
        return;
    }

    await transport.handleRequest(req, res, req.body);
};

const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};

app.post('/', authMiddleware, mcpPostHandler);
app.get('/', authMiddleware, handleSessionRequest);
app.delete('/', authMiddleware, handleSessionRequest);

app.listen(PORT, () => {
    console.log(`🚀 MCP Server running on http://localhost:${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
});