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
      name: "mcp-loop-server",
      title: "MCP Loop Server",
      version: "1.0.0",
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

  // Admin API Resource
  server.registerResource(
    "Admin API",
    "loopfans://api/admin",
    {
      description: "API documentation for Admin API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/admin-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/admin",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading admin-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/admin",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Admin API documentation."
          }]
        };
      }
    }
  );

  // Apps API Resource
  server.registerResource(
    "Apps API",
    "loopfans://api/apps",
    {
      description: "API documentation for Apps API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/apps-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/apps",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading apps-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/apps",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Apps API documentation."
          }]
        };
      }
    }
  );

  // Arena API Resource
  server.registerResource(
    "Arena API",
    "loopfans://api/arena",
    {
      description: "API documentation for Arena API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/arena-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/arena",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading arena-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/arena",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Arena API documentation."
          }]
        };
      }
    }
  );

  // Billing API Resource
  server.registerResource(
    "Billing API",
    "loopfans://api/billing",
    {
      description: "API documentation for Billing API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/billing-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/billing",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading billing-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/billing",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Billing API documentation."
          }]
        };
      }
    }
  );

  // Common API Resource
  server.registerResource(
    "Common API",
    "loopfans://api/common",
    {
      description: "API documentation for Common API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/common-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/common",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading common-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/common",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Common API documentation."
          }]
        };
      }
    }
  );

  // Currency API Resource
  server.registerResource(
    "Currency API",
    "loopfans://api/currency",
    {
      description: "API documentation for Currency API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/currency-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/currency",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading currency-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/currency",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Currency API documentation."
          }]
        };
      }
    }
  );

  // Fan Funnel API Resource
  server.registerResource(
    "Fan Funnel API",
    "loopfans://api/fan-funnel",
    {
      description: "API documentation for Fan Funnel API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/fan-funnel-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/fan-funnel",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading fan-funnel-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/fan-funnel",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Fan Funnel API documentation."
          }]
        };
      }
    }
  );

  // Feature Limits API Resource
  server.registerResource(
    "Feature Limits API",
    "loopfans://api/feature-limits",
    {
      description: "API documentation for Feature Limits API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/feature-limits-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/feature-limits",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading feature-limits-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/feature-limits",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Feature Limits API documentation."
          }]
        };
      }
    }
  );

  // File API Resource
  server.registerResource(
    "File API",
    "loopfans://api/file",
    {
      description: "API documentation for File API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/file-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/file",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading file-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/file",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load File API documentation."
          }]
        };
      }
    }
  );

  // Indexer API Resource
  server.registerResource(
    "Indexer API",
    "loopfans://api/indexer",
    {
      description: "API documentation for Indexer API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/indexer-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/indexer",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading indexer-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/indexer",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Indexer API documentation."
          }]
        };
      }
    }
  );

  // Launchpad API Resource
  server.registerResource(
    "Launchpad API",
    "loopfans://api/launchpad",
    {
      description: "API documentation for Launchpad API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/launchpad-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/launchpad",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading launchpad-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/launchpad",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Launchpad API documentation."
          }]
        };
      }
    }
  );

  // Loop WL Middleware API Resource
  server.registerResource(
    "Loop WL Middleware API",
    "loopfans://api/loop-wl-middleware",
    {
      description: "API documentation for Loop WL Middleware API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/loop_wl_middleware_api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/loop-wl-middleware",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading loop_wl_middleware_api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/loop-wl-middleware",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Loop WL Middleware API documentation."
          }]
        };
      }
    }
  );

  // Marketplace API Resource
  server.registerResource(
    "Marketplace API",
    "loopfans://api/marketplace",
    {
      description: "API documentation for Marketplace API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/marketplace-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/marketplace",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading marketplace-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/marketplace",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Marketplace API documentation."
          }]
        };
      }
    }
  );

  // Minter API Resource
  server.registerResource(
    "Minter API",
    "loopfans://api/minter",
    {
      description: "API documentation for Minter API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/minter-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/minter",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading minter-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/minter",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Minter API documentation."
          }]
        };
      }
    }
  );

  // Music Library API Resource
  server.registerResource(
    "Music Library API",
    "loopfans://api/music-library",
    {
      description: "API documentation for Music Library API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/music-library-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/music-library",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading music-library-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/music-library",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Music Library API documentation."
          }]
        };
      }
    }
  );

  // Payments API Resource
  server.registerResource(
    "Payments API",
    "loopfans://api/payments",
    {
      description: "API documentation for Payments API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/payments-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/payments",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading payments-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/payments",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Payments API documentation."
          }]
        };
      }
    }
  );

  // Rewards API Resource
  server.registerResource(
    "Rewards API",
    "loopfans://api/rewards",
    {
      description: "API documentation for Rewards API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/rewards-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/rewards",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading rewards-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/rewards",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Rewards API documentation."
          }]
        };
      }
    }
  );

  // Scripts API Resource
  server.registerResource(
    "Scripts API",
    "loopfans://api/scripts",
    {
      description: "API documentation for Scripts API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/scripts-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/scripts",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading scripts-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/scripts",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Scripts API documentation."
          }]
        };
      }
    }
  );

  // Templates API Resource
  server.registerResource(
    "Templates API",
    "loopfans://api/templates",
    {
      description: "API documentation for Templates API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/templates-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/templates",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading templates-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/templates",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Templates API documentation."
          }]
        };
      }
    }
  );

  // Umami API Resource
  server.registerResource(
    "Umami API",
    "loopfans://api/umami",
    {
      description: "API documentation for Umami API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/umami-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/umami",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading umami-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/umami",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Umami API documentation."
          }]
        };
      }
    }
  );

  // Users API Resource
  server.registerResource(
    "Users API",
    "loopfans://api/users",
    {
      description: "API documentation for Users API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/users-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/users",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading users-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/users",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Users API documentation."
          }]
        };
      }
    }
  );

  // Whitelabel API Resource
  server.registerResource(
    "Whitelabel API",
    "loopfans://api/whitelabel",
    {
      description: "API documentation for Whitelabel API",
      mimeType: "text/markdown"
    },
    async () => {
      try {
        const content = await fs.promises.readFile(
          "./docs/whitelabel-api.md",
          "utf-8"
        );
        return {
          contents: [{
            uri: "loopfans://api/whitelabel",
            mimeType: "text/markdown",
            text: content
          }]
        };
      } catch (error) {
        console.error("Error reading whitelabel-api.md:", error);
        return {
          contents: [{
            uri: "loopfans://api/whitelabel",
            mimeType: "text/markdown",
            text: "# Error\n\nFailed to load Whitelabel API documentation."
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
