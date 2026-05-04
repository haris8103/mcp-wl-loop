
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import dotenv from "dotenv";
import axios from "axios";
import {
    StreamableHTTPServerTransport,
    EventStore,
} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import cors from "cors";
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
// const PORT = 3001;
// const app = createMcpExpressApp();
// app.use(cors());
// app.set('trust proxy', true);

// app.use((req, res, next) => {
//     // Force host to bypass MCP internal validation
//     req.headers.host = "localhost";
//     next();
// });

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        console.error("Reached 1")
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
    } catch (error) {
        console.error(error)
        return error
    }

};

// Simple in-memory event store for SSE resumability
class InMemoryEventStore implements EventStore {
    private events: Map<string, { streamId: string; message: unknown }> =
        new Map();

    async storeEvent(streamId: string, message: unknown): Promise<string> {
        const eventId = randomUUID();
        this.events.set(eventId, { streamId, message });
        return eventId;
    }

    async replayEventsAfter(
        lastEventId: string,
        { send }: { send: (eventId: string, message: unknown) => Promise<void> }
    ): Promise<string> {
        const entries = Array.from(this.events.entries());
        const startIndex = entries.findIndex(([id]) => id === lastEventId);
        if (startIndex === -1) return lastEventId;

        let lastId: string = lastEventId;
        for (let i = startIndex + 1; i < entries.length; i++) {
            const [eventId, { message }] = entries[i];
            await send(eventId, message);
            lastId = eventId;
        }
        return lastId;
    }
}

console.log("Starting Streamable HTTP server...");

// Express app with permissive CORS for testing with Inspector direct connect mode
const app = express();
app.use(
    cors({
        origin: "*", // use "*" with caution in production
        methods: "GET,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: ["mcp-session-id", "last-event-id", "mcp-protocol-version"],
    })
);

// Map sessionId to server transport for each client
const transports: Map<string, StreamableHTTPServerTransport> = new Map<
    string,
    StreamableHTTPServerTransport
>();

// Handle POST requests for client messages
app.post("/mcp", authMiddleware, async (req: Request, res: Response) => {
    console.log("Received MCP POST request");
    try {
        // Check for existing session ID
        const sessionId = req.headers["mcp-session-id"] as string | undefined;

        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports.has(sessionId)) {
            // Reuse existing transport
            transport = transports.get(sessionId)!;
        } else if (!sessionId) {


            // New initialization request
            const eventStore = new InMemoryEventStore();
            transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: () => randomUUID(),
                eventStore, // Enable resumability
                onsessioninitialized: (sessionId: string) => {
                    // Store the transport by session ID when a session is initialized
                    // This avoids race conditions where requests might come in before the session is stored
                    console.log(`Session initialized with ID: ${sessionId}`);
                    transports.set(sessionId, transport);
                },
            });

            // Set up onclose handler to clean up transport when closed
            server.server.onclose = async () => {
                const sid = transport.sessionId;
                if (sid && transports.has(sid)) {
                    console.log(
                        `Transport closed for session ${sid}, removing from transports map`
                    );
                    transports.delete(sid);
                    // cleanup(sid);
                }
            };

            // Connect the transport to the MCP server BEFORE handling the request
            // so responses can flow back through the same transport
            await server.connect(transport);
            await transport.handleRequest(req, res);
            return;
        } else {
            // Invalid request - no session ID or not initialization request
            res.status(400).json({
                jsonrpc: "2.0",
                error: {
                    code: -32000,
                    message: "Bad Request: No valid session ID provided",
                },
                id: req?.body?.id,
            });
            return;
        }

        // Handle the request with existing transport - no need to reconnect
        // The existing transport is already connected to the server
        await transport.handleRequest(req, res);
    } catch (error) {
        console.log("Error handling MCP request:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                error: {
                    code: -32603,
                    message: "Internal server error",
                },
                id: req?.body?.id,
            });
            return;
        }
    }
});

// Handle GET requests for SSE streams
app.get("/mcp", authMiddleware, async (req: Request, res: Response) => {
    console.log("Received MCP GET request");
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
            },
            id: req?.body?.id,
        });
        return;
    }

    // Check for Last-Event-ID header for resumability
    const lastEventId = req.headers["last-event-id"] as string | undefined;
    if (lastEventId) {
        console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
    } else {
        console.log(`Establishing new SSE stream for session ${sessionId}`);
    }

    const transport = transports.get(sessionId);
    await transport!.handleRequest(req, res);
});

// Handle DELETE requests for session termination
app.delete("/mcp", authMiddleware, async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !transports.has(sessionId)) {
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
            },
            id: req?.body?.id,
        });
        return;
    }

    console.log(`Received session termination request for session ${sessionId}`);

    try {
        const transport = transports.get(sessionId);
        await transport!.handleRequest(req, res);
    } catch (error) {
        console.log("Error handling session termination:", error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: "2.0",
                error: {
                    code: -32603,
                    message: "Error handling session termination",
                },
                id: req?.body?.id,
            });
            return;
        }
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
const app_server = app.listen(PORT, () => {
    console.error(`MCP Streamable HTTP Server listening on port ${PORT}`);
});

// Handle server errors
app_server.on("error", (err: unknown) => {
    const code =
        typeof err === "object" && err !== null && "code" in err
            ? (err as { code?: unknown }).code
            : undefined;
    if (code === "EADDRINUSE") {
        console.error(
            `Failed to start: Port ${PORT} is already in use. Set PORT to a free port or stop the conflicting process.`
        );
    } else {
        console.error("HTTP server encountered an error while starting:", err);
    }
    // Ensure a non-zero exit so npm reports the failure instead of silently exiting
    process.exit(1);
});

// Handle server shutdown
process.on("SIGINT", async () => {
    console.log("Shutting down server...");

    // Close all active transports to properly clean up resources
    for (const sessionId in transports) {
        try {
            console.log(`Closing transport for session ${sessionId}`);
            await transports.get(sessionId)!.close();
            transports.delete(sessionId);
        } catch (error) {
            console.log(`Error closing transport for session ${sessionId}:`, error);
        }
    }

    console.log("Server shutdown complete");
    process.exit(0);
});
