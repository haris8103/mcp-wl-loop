import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  InMemoryTaskStore,
  InMemoryTaskMessageQueue,
} from "@modelcontextprotocol/sdk/experimental/tasks";
import fs from "fs";
// import {
//   setSubscriptionHandlers,
//   stopSimulatedResourceUpdates,
// } from "../resources/subscriptions.js";
// import { registerConditionalTools, registerTools } from "../tools/index.js";
// import { registerResources, readInstructions } from "../resources/index.js";
// import { registerPrompts } from "../prompts/index.js";
import { stopSimulatedLogging } from "./logging.js";
import { syncRoots } from "./roots.js";

// Server Factory response
export type ServerFactoryResponse = {
  server: McpServer;
  cleanup: (sessionId?: string) => void;
};

/**
 * Server Factory
 *
 * This function initializes a `McpServer` with specific capabilities and instructions,
 * registers tools, resources, and prompts, and configures resource subscription handlers.
 *
 * @returns {ServerFactoryResponse} An object containing the server instance, and a `cleanup`
 * function for handling server-side cleanup when a session ends.
 *
 * Properties of the returned object:
 * - `server` {Object}: The initialized server instance.
 * - `cleanup` {Function}: Function to perform cleanup operations for a closing session.
 */
export const createServer: () => ServerFactoryResponse = () => {
  // Read the server instructions
  // const instructions = readInstructions();

  // Create task store and message queue for task support
  const taskStore = new InMemoryTaskStore();
  const taskMessageQueue = new InMemoryTaskMessageQueue();

  let initializeTimeout: NodeJS.Timeout | null = null;

  // Create the server
  const server = new McpServer(
    {
      name: "mcp-servers/everything",
      title: "Everything Reference Server",
      version: "2.0.0",
    },
    {
      // capabilities: {
      //   tools: {
      //     listChanged: true,
      //   },
      //   prompts: {
      //     listChanged: true,
      //   },
      //   resources: {
      //     subscribe: true,
      //     listChanged: true,
      //   },
      //   logging: {},
      //   tasks: {
      //     list: {},
      //     cancel: {},
      //     requests: {
      //       tools: {
      //         call: {},
      //       },
      //     },
      //   },
      // },
      // instructions,
      taskStore,
      taskMessageQueue,
    }
  );

  // // Register the tools
  // registerTools(server);

  // // Register the resources
  // registerResources(server);

  // // Register the prompts
  // registerPrompts(server);

  // // Set resource subscription handlers
  // setSubscriptionHandlers(server);


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



  // Perform post-initialization operations
  server.server.oninitialized = async () => {
    // Register conditional tools now that client capabilities are known.
    // This finishes before the `notifications/initialized` handler finishes.
    // registerConditionalTools(server);

    // Sync roots if the client supports them.
    // This is delayed until after the `notifications/initialized` handler finishes,
    // otherwise, the request gets lost.
    const sessionId = server.server.transport?.sessionId;
    initializeTimeout = setTimeout(() => syncRoots(server, sessionId), 350);
  };

  // Return the ServerFactoryResponse
  return {
    server,
    cleanup: (sessionId?: string) => {
      // Stop any simulated logging or resource updates that may have been initiated.
      stopSimulatedLogging(sessionId);
      // stopSimulatedResourceUpdates(sessionId);
      // Clean up task store timers
      taskStore.cleanup();
      if (initializeTimeout) clearTimeout(initializeTimeout);
    },
  } satisfies ServerFactoryResponse;
};
