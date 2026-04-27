import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from "dotenv";
import axios from "axios";
import express from "express";
import cors from "cors";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import type { Request, Response } from 'express';
import * as fs from "fs";

dotenv.config();

// MCP Server
const server = new McpServer({
    name: "loopfans-wl-mcp-server",
    version: "1.0.0",
});

// EXPRESS APP
const PORT = 3001;
const app = createMcpExpressApp();

// ✅ IMPORTANT: Railway runs behind proxy
app.set('trust proxy', true);

// ✅ CRITICAL FIX: bypass MCP host validation
app.use((req, res, next) => {
    req.headers.host = "localhost";
    next();
});

app.use(cors());

// TRANSPORTS
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// ✅ FIXED AUTH (no crash)
const authMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token) token = req.headers.authorization;

        const response = await axios({
            url: `http://api.loop.fans/v1/apps/verify`,
            method: "get",
            headers: { "x-api-key": token },
        });

        if (response.status !== 200) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        next();
    } catch (err) {
        console.error("Auth error:", err?.response?.data || err.message);
        return res.status(401).json({ error: 'Auth failed' });
    }
};

// MCP POST HANDLER
const mcpPostHandler = async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
    }
    else if (!sessionId && isInitializeRequest(req.body)) {

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
    }
    else {
        return res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
    }

    await transport.handleRequest(req, res, req.body);
};

// SESSION HANDLER
const handleSessionRequest = async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (!sessionId || !transports[sessionId]) {
        return res.status(400).send('Invalid or missing session ID');
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};

// ROUTES
app.post('/', authMiddleware, mcpPostHandler);
app.get('/', authMiddleware, handleSessionRequest);
app.delete('/', authMiddleware, handleSessionRequest);

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 MCP Server running on http://0.0.0.0:${PORT}`);
});

// SHUTDOWN
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    process.exit(0);
});