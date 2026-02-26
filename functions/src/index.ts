import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

// ── Secrets (stored in Google Secret Manager, NOT in client bundle) ──
const weatherApiKey = defineSecret("WEATHER_API_KEY");
const openrouterApiKey = defineSecret("OPENROUTER_API_KEY");
const BTMC_API_KEY = "3kd8ub1llcg9t45hnoh8hmn7t5kc2v";

// ── Gold API key auto-refresh (expires every 15 days) ──
let cachedGoldKey: string | null = null;
let goldKeyExpiry = 0; // unix ms

async function getGoldApiKey(): Promise<string> {
  const now = Date.now();
  if (cachedGoldKey && now < goldKeyExpiry) {
    return cachedGoldKey;
  }

  const response = await fetch(
    "https://api.vnappmob.com/api/request_api_key?scope=gold",
  );
  if (!response.ok) {
    throw new Error(`Failed to request gold API key (HTTP ${response.status})`);
  }
  const data = (await response.json()) as { results: string };
  cachedGoldKey = data.results;
  // Key is valid for 15 days; refresh 1 day early to be safe
  goldKeyExpiry = now + 14 * 24 * 60 * 60 * 1000;
  return cachedGoldKey;
}

// ── CORS helper ──
const ALLOWED_ORIGINS = [
  "https://tforart.vn",
  "https://tforart-dev.web.app",
  "https://tforart-dev.firebaseapp.com",
];

function setCors(
  req: { headers: { origin?: string } },
  res: { setHeader: (key: string, value: string) => void },
) {
  const origin = req.headers.origin ?? "";
  if (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.startsWith("http://localhost")
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");
}

type BtmcRawItem = Record<string, unknown>;

interface BtmcNormalizedItem {
  name: string;
  buy: number;
  sell: number;
  updated_at: string;
}

function getDynamicField(item: BtmcRawItem, prefix: string): string {
  // Handle both JSON format (@prefix) and XML format (prefix)
  const entry = Object.entries(item).find(
    ([key]) => key.startsWith(`@${prefix}`) || key.startsWith(prefix),
  );
  return typeof entry?.[1] === "string" ? entry[1] : "";
}

// ── BTMC target gold products ──
const BTMC_GOLD_CATEGORIES: Array<{
  displayName: string;
  test: (name: string) => boolean;
}> = [
  {
    displayName: "Vàng miếng SJC",
    test: (name) => /VÀNG.*MIẾNG.*SJC/i.test(name),
  },
  {
    displayName: "Vàng miếng VRTL Bảo Tín Minh Châu",
    test: (name) =>
      /VÀNG.*MIẾNG/i.test(name) && /RỒNG.*THĂNG.*LONG/i.test(name),
  },
  {
    displayName: "Nhẫn tròn trơn Bảo Tín Minh Châu",
    test: (name) => /NHẪN.*TRÒN.*TRƠN/i.test(name),
  },
  {
    displayName: "Quà mừng bản vị vàng Bảo Tín Minh Châu",
    test: (name) => /QU[ÀA].*MỪNG/i.test(name),
  },
];

function parseBtmcDateToTimestamp(dateText: string): number {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/.exec(
    dateText.trim(),
  );
  if (!match) {
    return 0;
  }

  const [, day, month, year, hour, minute] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  ).getTime();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// /api/weather  –  proxy to OpenWeatherMap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const weather = onRequest(
  { secrets: [weatherApiKey], region: "asia-southeast1" },
  async (req, res) => {
    setCors(req, res);

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const city = req.query["city"] as string | undefined;
    const type = (req.query["type"] as string) ?? "weather"; // "weather" | "forecast"

    if (!city) {
      res.status(400).json({ error: "Missing 'city' query parameter" });
      return;
    }

    const allowedTypes = ["weather", "forecast"];
    if (!allowedTypes.includes(type)) {
      res
        .status(400)
        .json({ error: "Invalid type. Use 'weather' or 'forecast'" });
      return;
    }

    try {
      const apiKey = weatherApiKey.value();
      const url = `https://api.openweathermap.org/data/2.5/${type}?q=${encodeURIComponent(
        city,
      )}&units=metric&appid=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        res.status(response.status).json({
          error: `OpenWeatherMap returned ${response.status}`,
        });
        return;
      }

      const data = await response.json();

      // Cache weather for 5 min, forecast for 15 min
      const maxAge = type === "forecast" ? 900 : 300;
      res.setHeader("Cache-Control", `public, max-age=${maxAge}`);
      res.status(200).json(data);
    } catch (error) {
      console.error("Weather proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// /api/gold  –  proxy to VNAppMob Gold API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const gold = onRequest(
  { region: "asia-southeast1" },
  async (req, res) => {
    setCors(req, res);

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const provider = req.query["provider"] as string | undefined;
    const allowedProviders = ["sjc", "doji", "pnj", "btmc"];

    if (!provider || !allowedProviders.includes(provider)) {
      res.status(400).json({
        error:
          "Missing or invalid 'provider'. Use 'sjc', 'doji', 'pnj', or 'btmc'",
      });
      return;
    }

    if (provider === "btmc") {
      try {
        const response = await fetch(
          `http://api.btmc.vn/api/BTMCAPI/getpricebtmc?key=${BTMC_API_KEY}`,
        );

        if (!response.ok) {
          res.status(response.status).json({
            error: `BTMC API returned ${response.status}`,
          });
          return;
        }

        const text = await response.text();

        // Parse records — try JSON first, fall back to XML regex
        let records: BtmcRawItem[] = [];

        try {
          const jsonData = JSON.parse(text) as {
            DataList?: { Data?: unknown[] };
          };
          const arr = jsonData?.DataList?.Data;
          if (Array.isArray(arr)) {
            records = arr.filter(
              (r): r is BtmcRawItem => typeof r === "object" && r !== null,
            );
          }
        } catch {
          // Response is XML — extract <Data .../> elements
          const dataTagRe = /<Data\s+([^>]*?)\/?>/g;
          const attrRe = /([\w]+)="([^"]*)"/g;
          let tagMatch: RegExpExecArray | null;

          while ((tagMatch = dataTagRe.exec(text)) !== null) {
            const attrs: BtmcRawItem = {};
            let attrMatch: RegExpExecArray | null;
            while ((attrMatch = attrRe.exec(tagMatch[1])) !== null) {
              attrs[attrMatch[1]] = attrMatch[2];
            }
            records.push(attrs);
          }
        }

        // Normalize every record into { name, buy, sell, updated_at }
        const normalized = records
          .map((record) => {
            const name = getDynamicField(record, "n_").trim();
            const buy = Number.parseInt(getDynamicField(record, "pb_"), 10);
            const sell = Number.parseInt(getDynamicField(record, "ps_"), 10);
            const updated_at = getDynamicField(record, "d_").trim();

            return {
              name,
              buy: Number.isNaN(buy) ? 0 : buy,
              sell: Number.isNaN(sell) ? 0 : sell,
              updated_at,
            } satisfies BtmcNormalizedItem;
          })
          .filter(
            (item) =>
              item.name.length > 0 &&
              (item.buy > 0 || item.sell > 0) &&
              item.updated_at.length > 0,
          );

        // Keep only the latest timestamp
        const latestTimestamp = normalized.reduce((max, item) => {
          const ts = parseBtmcDateToTimestamp(item.updated_at);
          return ts > max ? ts : max;
        }, 0);

        const latest = normalized.filter(
          (item) =>
            parseBtmcDateToTimestamp(item.updated_at) === latestTimestamp,
        );

        // Match target gold products and assign display names
        const results: BtmcNormalizedItem[] = [];

        for (const category of BTMC_GOLD_CATEGORIES) {
          const match = latest.find((item) => category.test(item.name));
          if (match) {
            results.push({ ...match, name: category.displayName });
          }
        }

        console.log("results", results);

        res.setHeader("Cache-Control", "public, max-age=300");
        res.status(200).json({ results });
      } catch (error) {
        console.error("BTMC proxy error:", error);
        res.status(500).json({ error: "Internal server error" });
      }

      return;
    }

    const fetchGold = async (apiKey: string) => {
      const url = `https://api.vnappmob.com/api/v2/gold/${provider}`;
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });
    };

    try {
      let apiKey = await getGoldApiKey();
      let response = await fetchGold(apiKey);

      // If 403 → key expired, force refresh and retry once
      if (response.status === 403) {
        cachedGoldKey = null;
        goldKeyExpiry = 0;
        apiKey = await getGoldApiKey();
        response = await fetchGold(apiKey);
      }

      if (!response.ok) {
        res.status(response.status).json({
          error: `VNAppMob Gold API returned ${response.status}`,
        });
        return;
      }

      const data = await response.json();

      // Cache gold prices for 5 minutes
      res.setHeader("Cache-Control", "public, max-age=300");
      res.status(200).json(data);
    } catch (error) {
      console.error("Gold proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// /api/chat  –  proxy to OpenRouter
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const chat = onRequest(
  { secrets: [openrouterApiKey], region: "asia-southeast1" },
  async (req, res) => {
    setCors(req, res);

    // Handle preflight
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const body = req.body as {
      model?: string;
      messages?: Array<{ role: string; content: string }>;
    };

    if (!body.model || !body.messages || !Array.isArray(body.messages)) {
      res.status(400).json({ error: "Missing 'model' or 'messages' in body" });
      return;
    }

    // Validate messages — only allow user/assistant roles, limit length
    const MAX_MESSAGES = 50;
    const MAX_CONTENT_LENGTH = 10000;

    const sanitizedMessages = body.messages.slice(-MAX_MESSAGES).map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content:
        typeof msg.content === "string"
          ? msg.content.slice(0, MAX_CONTENT_LENGTH)
          : "",
    }));

    try {
      const apiKey = openrouterApiKey.value();

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "https://tforart.vn/",
            "X-Title": "AI Chatbot",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: body.model,
            messages: sanitizedMessages,
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter error:", response.status, errText);
        res.status(response.status).json({
          error: `OpenRouter returned ${response.status}`,
        });
        return;
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Chat proxy error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);
