import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const registerApiTools = (server: McpServer) => {

  // Tool: admin_api
  server.tool(
    "admin_api",
    "Unified API tool for admin operations.",
    {
      operation: z.enum(["update_collection", "update_user"]).describe("The operation to perform"),
      id: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "update_collection":
          method = "POST";
          path = `/v1/admin/action/update_collection/${args.id}`;
          break;
        case "update_user":
          method = "POST";
          path = `/v1/admin/action/update_user/${args.id}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: arena_api
  server.tool(
    "arena_api",
    "Unified API tool for arena operations.",
    {
      operation: z.enum(["create_comment", "like_unlike", "actions_api_views", "main_arena_api_views_arena_index_mjs", "arena_collections_api_views_arena_collections_index_mjs", "courses_api_views_arena_courses_index_mjs", "leaderboard", "gallery_api_views_arena_gallery_index_mjs"]).describe("The operation to perform"),
      id: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "create_comment":
          method = "POST";
          path = `/v1/arena/action/comment`;
          break;
        case "like_unlike":
          method = "POST";
          path = `/v1/arena/action/like`;
          break;
        case "actions_api_views":
          method = "POST";
          path = `/v1/arena/action/fetchByDate`;
          break;
        case "main_arena_api_views_arena_index_mjs":
          method = "POST";
          path = `/v1/arena/event`;
          break;
        case "arena_collections_api_views_arena_collections_index_mjs":
          method = "GET";
          path = `/v1/arena/collections`;
          break;
        case "courses_api_views_arena_courses_index_mjs":
          method = "GET";
          path = `/v1/courses/intro/${args.id}`;
          break;
        case "leaderboard":
          method = "GET";
          path = `/v1/arena/leaderboard/me`;
          break;
        case "gallery_api_views_arena_gallery_index_mjs":
          method = "GET";
          path = `/v1/albums/galleries`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: billing_api
  server.tool(
    "billing_api",
    "Unified API tool for billing operations.",
    {
      operation: z.enum(["get_all_tiers_subscriptions", "get_user_current_plan", "upgrade_start_subscription", "upgrade_success_callback", "upgrade_cancel_callback", "get_subscription_details", "get_available_plans_user_specific", "stripe_webhook"]).describe("The operation to perform"),
      body: z.any().optional().describe("JSON request body"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_all_tiers_subscriptions":
          method = "GET";
          path = `/v1/tiers-n-subscriptions`;
          break;
        case "get_user_current_plan":
          method = "GET";
          path = `/v1/user/billing/plan`;
          break;
        case "upgrade_start_subscription":
          method = "POST";
          path = `/v1/user/billing/upgrade`;
          break;
        case "upgrade_success_callback":
          method = "GET";
          path = `/v1/user/billing/success?session_id=<id>`;
          break;
        case "upgrade_cancel_callback":
          method = "GET";
          path = `/v1/user/billing/cancel`;
          break;
        case "get_subscription_details":
          method = "GET";
          path = `/v1/user/billing/subscription/details`;
          break;
        case "get_available_plans_user_specific":
          method = "GET";
          path = `/v1/user/billing/plans`;
          break;
        case "stripe_webhook":
          method = "POST";
          path = `/v1/billing/webhook`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: collections_api
  server.tool(
    "collections_api",
    "Unified API tool for collections operations.",
    {
      operation: z.enum(["get_collection_by_url", "get_collections_filtered_sorted", "get_collection_details_by_url", "get_creator_collections"]).describe("The operation to perform"),
      address: z.string().optional().describe("Parameter for specific operations"),
      id: z.string().optional().describe("Parameter for specific operations"),
      username: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_collection_by_url":
          method = "GET";
          path = `/v1/collectionByUrl/${args.address}`;
          break;
        case "get_collections_filtered_sorted":
          method = "POST";
          path = `/v1/collections`;
          break;
        case "get_collection_details_by_url":
          method = "GET";
          path = `/v1/collection/${args.id}`;
          break;
        case "get_creator_collections":
          method = "GET";
          path = `/v1/collections/creator/${args.username}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: common_api
  server.tool(
    "common_api",
    "Unified API tool for common operations.",
    {
      operation: z.enum(["check_authentication", "platform_faqs", "platform_menu", "clear_cache"]).describe("The operation to perform"),
      platform: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "check_authentication":
          method = "POST";
          path = `/v1/checkAuth`;
          break;
        case "platform_faqs":
          method = "GET";
          path = `/v1/faqs/${args.platform}`;
          break;
        case "platform_menu":
          method = "GET";
          path = `/v1/platform_menu`;
          break;
        case "clear_cache":
          method = "POST";
          path = `/clear-cache`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: currency_api
  server.tool(
    "currency_api",
    "Unified API tool for currency operations.",
    {
      operation: z.enum(["get_conversion_rate"]).describe("The operation to perform"),
      code: z.string().optional().describe("Parameter for specific operations"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_conversion_rate":
          method = "GET";
          path = `/v1/currency/rate/${args.code}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: fans_api
  server.tool(
    "fans_api",
    "Unified API tool for fans operations.",
    {
      operation: z.enum(["get_fans_homepage", "get_creators", "get_artist_profile", "get_fan_collections", "get_fan_collections_by_username", "get_featured_artist", "get_fans_exclusive", "get_fans_launchpad", "get_fans_launchpad_detail", "get_fans_launchpad_insights", "get_fans_launchpad_transactions", "get_fans_launchpad_transactions_by_collection", "get_payment_transactions", "follow_an_artist", "customers_manage_audience", "get_collections_post", "check_nft_owner", "fans_launchpad_form_submissions", "get_launchpad_form_submission_fans"]).describe("The operation to perform"),
      id: z.string().optional().describe("Parameter for specific operations"),
      username: z.string().optional().describe("Parameter for specific operations"),
      page: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_fans_homepage":
          method = "GET";
          path = `/v1/fans/pages/fans_homepage`;
          break;
        case "get_creators":
          method = "GET";
          path = `/v1/fans/creators`;
          break;
        case "get_artist_profile":
          method = "GET";
          path = `/v1/fans/artist/${args.id}`;
          break;
        case "get_fan_collections":
          method = "GET";
          path = `/v1/fans/fans_collections`;
          break;
        case "get_fan_collections_by_username":
          method = "GET";
          path = `/v1/fans/fans_collections/${args.username}`;
          break;
        case "get_featured_artist":
          method = "GET";
          path = `/v1/fans/featured_artist`;
          break;
        case "get_fans_exclusive":
          method = "GET";
          path = `/v1/fans/fans_exclusive/${args.id}`;
          break;
        case "get_fans_launchpad":
          method = "GET";
          path = `/v1/fans/fans_launchpad/${args.id}?isId=true`;
          break;
        case "get_fans_launchpad_detail":
          method = "GET";
          path = `/v1/fans/fans_launchpad/detail/${args.id}`;
          break;
        case "get_fans_launchpad_insights":
          method = "GET";
          path = `/v1/fans/fans_launchpad/insights/${args.id}`;
          break;
        case "get_fans_launchpad_transactions":
          method = "GET";
          path = `/v1/fans/fans_launchpad/insights/transactions/${args.id}/${args.page}`;
          break;
        case "get_fans_launchpad_transactions_by_collection":
          method = "POST";
          path = `/v1/fans/fans_launchpad/transactions/byCollection`;
          break;
        case "get_payment_transactions":
          method = "GET";
          path = `/v1/fans/payment_transactions/${args.page}`;
          break;
        case "follow_an_artist":
          method = "POST";
          path = `/v1/fans/following`;
          break;
        case "customers_manage_audience":
          method = "POST";
          path = `/v1/fans/customers`;
          break;
        case "get_collections_post":
          method = "POST";
          path = `/v1/fans/get/collections`;
          break;
        case "check_nft_owner":
          method = "POST";
          path = `/v1/fans/nft/owner`;
          break;
        case "fans_launchpad_form_submissions":
          method = "POST";
          path = `/v1/fans_launchpad_submissions`;
          break;
        case "get_launchpad_form_submission_fans":
          method = "GET";
          path = `/v1/fans_launchpad_submissions/fans`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: feature-limits_api
  server.tool(
    "feature-limits_api",
    "Unified API tool for feature-limits operations.",
    {
      operation: z.enum(["get_feature_limits"]).describe("The operation to perform"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_feature_limits":
          method = "GET";
          path = `/v1/feature_limits`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: indexer_api
  server.tool(
    "indexer_api",
    "Unified API tool for indexer operations.",
    {
      operation: z.enum(["get_nfts_by_owner", "get_nfts_by_owner_id_authenticated", "get_nft_details_external_indexer", "get_nft_details_directus", "get_nfts_by_collection", "get_collection_details", "get_nft_events", "get_user_events", "get_number_of_nfts_by_artist"]).describe("The operation to perform"),
      address: z.string().optional().describe("Parameter for specific operations"),
      page: z.string().optional().describe("Parameter for specific operations"),
      limit: z.string().optional().describe("Parameter for specific operations"),
      id: z.string().optional().describe("Parameter for specific operations"),
      contract: z.string().optional().describe("Parameter for specific operations"),
      artistId: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_nfts_by_owner":
          method = "GET";
          path = `/v1/indexer/nfts/owner/${args.address}/${args.page}/${args.limit}`;
          break;
        case "get_nfts_by_owner_id_authenticated":
          method = "POST";
          path = `/v1/indexer/nfts/owner_id/${args.page}/${args.limit}`;
          break;
        case "get_nft_details_external_indexer":
          method = "GET";
          path = `/v1/indexer/nft/${args.address}/${args.limit}`;
          break;
        case "get_nft_details_directus":
          method = "GET";
          path = `/v1/indexer/nftDetail/${args.id}`;
          break;
        case "get_nfts_by_collection":
          method = "GET";
          path = `/v1/indexer/nfts/collection/${args.contract}/${args.page}/${args.limit}`;
          break;
        case "get_collection_details":
          method = "GET";
          path = `/v1/indexer/collection/${args.contract}`;
          break;
        case "get_nft_events":
          method = "GET";
          path = `/v1/indexer/events/nft/${args.address}/${args.limit}`;
          break;
        case "get_user_events":
          method = "GET";
          path = `/v1/indexer/events/user/${args.address}`;
          break;
        case "get_number_of_nfts_by_artist":
          method = "GET";
          path = `/v1/indexer/nfts/artist/${args.artistId}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: marketplace_api
  server.tool(
    "marketplace_api",
    "Unified API tool for marketplace operations.",
    {
      operation: z.enum(["get_favorite_items", "check_if_item_is_favorite", "check_transaction_status", "load_default_configurations"]).describe("The operation to perform"),
      platoform: z.string().optional().describe("Parameter for specific operations"),
      id: z.string().optional().describe("Parameter for specific operations"),
      platform: z.string().optional().describe("Parameter for specific operations"),
      type: z.string().optional().describe("Parameter for specific operations"),
      address: z.string().optional().describe("Parameter for specific operations"),
      transaction_id: z.string().optional().describe("Parameter for specific operations"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_favorite_items":
          method = "GET";
          path = `/v1/marketplace/favs/${args.platoform}/${args.id}`;
          break;
        case "check_if_item_is_favorite":
          method = "GET";
          path = `/v1/marketplace/favs/${args.platform}/${args.type}/${args.id}/${args.address}`;
          break;
        case "check_transaction_status":
          method = "GET";
          path = `/v1/marketplace/transaction_status/${args.transaction_id}`;
          break;
        case "load_default_configurations":
          method = "POST";
          path = `/v1/marketplace/load_default`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: minter_api
  server.tool(
    "minter_api",
    "Unified API tool for minter operations.",
    {
      operation: z.enum(["claim_nft", "get_redeemables", "redeem_nft"]).describe("The operation to perform"),
      nft_id: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "claim_nft":
          method = "POST";
          path = `/v1/minter/claimNft`;
          break;
        case "get_redeemables":
          method = "GET";
          path = `/v1/minter/redeemables/${args.nft_id}`;
          break;
        case "redeem_nft":
          method = "POST";
          path = `/v1/minter/redeem`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: music-library_api
  server.tool(
    "music-library_api",
    "Unified API tool for music-library operations.",
    {
      operation: z.enum(["get_library", "get_albums", "get_album_details"]).describe("The operation to perform"),
      id: z.string().optional().describe("Parameter for specific operations"),
      headers: z.any().optional().describe("Headers (e.g. cookie, x-api-key)"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_library":
          method = "GET";
          path = `/v1/music/library`;
          break;
        case "get_albums":
          method = "GET";
          path = `/v1/music/albums`;
          break;
        case "get_album_details":
          method = "GET";
          path = `/v1/music/album/${args.id}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: payments_api
  server.tool(
    "payments_api",
    "Unified API tool for payments operations.",
    {
      operation: z.enum(["generate_checkout_url", "payment_events", "stripe_payment_events", "wompi_payment_events", "stripe_webhook", "create_payment_intent"]).describe("The operation to perform"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "generate_checkout_url":
          method = "POST";
          path = `/v1/payment/generate_paymentid`;
          break;
        case "payment_events":
          method = "POST";
          path = `/v1/payment/events`;
          break;
        case "stripe_payment_events":
          method = "POST";
          path = `/v1/payment/events/stripe`;
          break;
        case "wompi_payment_events":
          method = "POST";
          path = `/v1/payment/events/wompi`;
          break;
        case "stripe_webhook":
          method = "POST";
          path = `/v1/payment/webhook`;
          break;
        case "create_payment_intent":
          method = "POST";
          path = `/v1/payment/intent`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: rewards_api
  server.tool(
    "rewards_api",
    "Unified API tool for rewards operations.",
    {
      operation: z.enum(["get_rewards", "create_update_reward", "list_rewards", "get_reward_by_id", "create_update_quest", "list_quests", "get_quest_by_id", "create_update_user_reward", "list_user_rewards", "get_all_user_rewards", "get_user_reward_by_id", "create_update_user_quest", "change_quest_status", "list_user_quests", "get_all_user_quests", "get_user_quest_by_id"]).describe("The operation to perform"),
      reward_id: z.string().optional().describe("Parameter for specific operations"),
      quest_id: z.string().optional().describe("Parameter for specific operations"),
      user_reward_id: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_rewards":
          method = "GET";
          path = `/v1/rewards`;
          break;
        case "create_update_reward":
          method = "POST";
          path = `/v1/rewards`;
          break;
        case "list_rewards":
          method = "GET";
          path = `/v1/rewards/list`;
          break;
        case "get_reward_by_id":
          method = "GET";
          path = `/v1/rewards/${args.reward_id}`;
          break;
        case "create_update_quest":
          method = "POST";
          path = `/v1/rewards/quests`;
          break;
        case "list_quests":
          method = "GET";
          path = `/v1/rewards/quests/list`;
          break;
        case "get_quest_by_id":
          method = "GET";
          path = `/v1/rewards/quests/${args.quest_id}`;
          break;
        case "create_update_user_reward":
          method = "POST";
          path = `/v1/rewards/user`;
          break;
        case "list_user_rewards":
          method = "GET";
          path = `/v1/rewards/user/list`;
          break;
        case "get_all_user_rewards":
          method = "GET";
          path = `/v1/rewards/user/user/all`;
          break;
        case "get_user_reward_by_id":
          method = "GET";
          path = `/v1/rewards/user/${args.user_reward_id}`;
          break;
        case "create_update_user_quest":
          method = "POST";
          path = `/v1/rewards/quests/user`;
          break;
        case "change_quest_status":
          method = "POST";
          path = `/v1/rewards/quests/user/change_status`;
          break;
        case "list_user_quests":
          method = "GET";
          path = `/v1/rewards/quests/user/list`;
          break;
        case "get_all_user_quests":
          method = "GET";
          path = `/v1/rewards/quests/user/all`;
          break;
        case "get_user_quest_by_id":
          method = "GET";
          path = `/v1/rewards/quests/user/${args.quest_id}`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: scripts_api
  server.tool(
    "scripts_api",
    "Unified API tool for scripts operations.",
    {
      operation: z.enum(["generate_code"]).describe("The operation to perform"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "generate_code":
          method = "POST";
          path = `/v1/scripts/codeGen`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: templates_api
  server.tool(
    "templates_api",
    "Unified API tool for templates operations.",
    {
      operation: z.enum(["get_templates_list"]).describe("The operation to perform"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "get_templates_list":
          method = "GET";
          path = `/v1/templates`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: users_api
  server.tool(
    "users_api",
    "Unified API tool for users operations.",
    {
      operation: z.enum(["user_info", "following_ids", "follow_count", "following_list", "follower_list", "user_wallets", "create_post", "check_if_following", "follow_unfollow", "update_field", "update_profile", "update_genres", "add_favorite", "get_account_balance", "payout_history", "request_payout", "check_account", "send_payout_email", "send_form_email", "update_whatsapp", "merchant_events"]).describe("The operation to perform"),
      id: z.string().optional().describe("Parameter for specific operations"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "user_info":
          method = "POST";
          path = `/v1/user/userInfo`;
          break;
        case "following_ids":
          method = "POST";
          path = `/v1/user/followingIds`;
          break;
        case "follow_count":
          method = "POST";
          path = `/v1/user/followCount`;
          break;
        case "following_list":
          method = "POST";
          path = `/v1/user/followingList`;
          break;
        case "follower_list":
          method = "POST";
          path = `/v1/user/followerList`;
          break;
        case "user_wallets":
          method = "POST";
          path = `/v1/user/user-wallets`;
          break;
        case "create_post":
          method = "POST";
          path = `/v1/user/action/post`;
          break;
        case "check_if_following":
          method = "POST";
          path = `/v1/user/action/isFollowing`;
          break;
        case "follow_unfollow":
          method = "POST";
          path = `/v1/user/action/follow`;
          break;
        case "update_field":
          method = "POST";
          path = `/v1/user/action/update_field/${args.id}`;
          break;
        case "update_profile":
          method = "POST";
          path = `/v1/user/action/update_profile`;
          break;
        case "update_genres":
          method = "POST";
          path = `/v1/user/action/update_genres`;
          break;
        case "add_favorite":
          method = "POST";
          path = `/v1/user/action/add_fav`;
          break;
        case "get_account_balance":
          method = "POST";
          path = `/v1/user/action/account/balance`;
          break;
        case "payout_history":
          method = "POST";
          path = `/v1/user/action/payout/history`;
          break;
        case "request_payout":
          method = "POST";
          path = `/v1/user/action/payout/request`;
          break;
        case "check_account":
          method = "POST";
          path = `/v1/user/action/checkAccount`;
          break;
        case "send_payout_email":
          method = "POST";
          path = `/v1/user/action/sendPayoutEmail`;
          break;
        case "send_form_email":
          method = "POST";
          path = `/v1/user/action/sendFormEmail`;
          break;
        case "update_whatsapp":
          method = "POST";
          path = `/v1/user/update/whatsapp`;
          break;
        case "merchant_events":
          method = "POST";
          path = `/v1/merchant/events`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );

  // Tool: whitelabel_api
  server.tool(
    "whitelabel_api",
    "Unified API tool for whitelabel operations.",
    {
      operation: z.enum(["create_forms_block", "create_free_drops_block", "create_paid_drops_block"]).describe("The operation to perform"),
      body: z.any().optional().describe("JSON request body"),
    },
    async (args: any) => {
      const { operation } = args;
      let path = "";
      let method = "GET";
      
      switch (operation) {
        case "create_forms_block":
          method = "POST";
          path = `/v1/blocks/forms_block`;
          break;
        case "create_free_drops_block":
          method = "POST";
          path = `/v1/blocks/free_drops`;
          break;
        case "create_paid_drops_block":
          method = "POST";
          path = `/v1/blocks/paid_drops`;
          break;

        default:
          return {
            content: [{ type: "text", text: `Error: Unknown operation ${operation}` }]
          };
      }
      
      try {
        const config: any = { baseURL: BACKEND_URL };
        if (args.headers) {
          config.headers = args.headers;
        }
        
        let response;
        if (method === "GET" || method === "DELETE") {
          response = await axios({
            method,
            url: path,
            ...config
          });
        } else {
          response = await axios({
            method,
            url: path,
            data: args.body || {},
            ...config
          });
        }
        
        return {
          content: [{ type: "text", text: JSON.stringify(response.data, null, 2) }]
        };
      } catch (error: any) {
        console.error(`Error in ${operation}:`, error.message);
        const errorData = error.response?.data ? JSON.stringify(error.response.data) : error.message;
        return {
          content: [{ type: "text", text: `Error: ${errorData}` }]
        };
      }
    }
  );
};
