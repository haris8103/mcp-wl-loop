
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
    "loopfans://api/backend-server",
    {
        description: "Loopfans Backend Server API overview and getting started guide",
        mimeType: "text/markdown"
    },
    async () => {
        try {
            const content = await fs.promises.readFile(
                "./docs/architecture_backend_server.md",
                "utf-8"
            );
            return {
                contents: [{
                    uri: "loopfans://api/backend-server",
                    mimeType: "text/markdown",
                    text: content
                }]
            };
        } catch (error) {
            console.error("Error reading architecture_backend_server.md:", error);
            return {
                contents: [{
                    uri: "loopfans://api/backend-server",
                    mimeType: "text/markdown",
                    text: "# Error\n\nFailed to load backend server API documentation."
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
app.use(cors());
app.set('trust proxy', true);

app.use((req, res, next) => {
    // Force host to bypass MCP internal validation
    req.headers.host = "localhost";
    next();
});
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Reached 1")
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        token = req.headers.authorization;
    }
    const response = await axios({
        url: `https://proalien-nevaeh-tachygraphical.ngrok-free.dev/v1/apps/verify`,
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
    console.log("Reached 1")
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