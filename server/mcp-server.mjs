import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { z } from "zod";
import {
  compareAirQuality,
  fetchAirQuality,
  locations,
} from "./shared-air-quality.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const widgetHtml = readFileSync(
  join(__dirname, "../public/air-quality-widget.html"),
  "utf8"
);

const countryList = locations.map((l) => l.country).join(", ");

const locationSchema = {
  country: z.string().min(1).describe(`Country name. Supported: ${countryList}`),
};

const compareSchema = {
  countryA: z.string().min(1).describe("First country to compare"),
  countryB: z.string().min(1).describe("Second country to compare"),
};

function replyWithComparison(result, message) {
  return {
    content: message ? [{ type: "text", text: message }] : [],
    structuredContent: result,
  };
}

function createAirQualityServer() {
  const server = new McpServer({
    name: "global-air-quality-dashboard",
    version: "2.0.0",
  });

  server.registerResource(
    "air-quality-widget",
    "ui://widget/air-quality.html",
    {},
    async () => ({
      contents: [
        {
          uri: "ui://widget/air-quality.html",
          mimeType: "text/html+skybridge",
          text: widgetHtml,
          _meta: { "openai/widgetPrefersBorder": true },
        },
      ],
    })
  );

  server.registerTool(
    "get_air_quality",
    {
      title: "Get air quality",
      description: `Use this when the user asks about air quality for a single country. Returns live PM2.5, PM10, NO2, US AQI, risk level and insight. Supported: ${countryList}.`,
      inputSchema: locationSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/air-quality.html",
        "openai/toolInvocation/invoking": "Fetching air quality data",
        "openai/toolInvocation/invoked": "Air quality data ready",
      },
    },
    async (args) => {
      const data = await fetchAirQuality(args.country);
      const comparison = {
        countryA: data,
        countryB: data,
        betterCountry: data.country,
        summary: data.insight,
      };
      return replyWithComparison(
        comparison,
        `${data.country} (${data.location}): AQI ${data.aqi} (${data.status}). ${data.insight}`
      );
    }
  );

  server.registerTool(
    "compare_air_quality",
    {
      title: "Compare air quality",
      description: `Use this when the user wants to compare air quality between two countries worldwide. Supported: ${countryList}.`,
      inputSchema: compareSchema,
      _meta: {
        "openai/outputTemplate": "ui://widget/air-quality.html",
        "openai/toolInvocation/invoking": "Comparing air quality",
        "openai/toolInvocation/invoked": "Comparison ready",
      },
    },
    async (args) => {
      const result = await compareAirQuality(args.countryA, args.countryB);
      return replyWithComparison(result, result.summary);
    }
  );

  return server;
}

const port = Number(process.env.MCP_PORT ?? 8787);
const MCP_PATH = "/mcp";

const httpServer = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res
      .writeHead(200, { "content-type": "text/plain" })
      .end("Global Air Quality MCP server — endpoint: /mcp");
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const server = createAirQualityServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("MCP error:", error);
      if (!res.headersSent) res.writeHead(500).end("Internal server error");
    }
    return;
  }

  res.writeHead(404).end("Not Found");
});

httpServer.listen(port, () => {
  console.log(
    `Global Air Quality MCP server listening on http://localhost:${port}${MCP_PATH}`
  );
});
