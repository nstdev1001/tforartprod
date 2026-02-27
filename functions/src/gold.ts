import { setCors } from "./cors";
import { onRequest } from "firebase-functions/v2/https";

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

// ── BTMC types ──
type BtmcRawItem = Record<string, unknown>;

interface BtmcNormalizedItem {
  name: string;
  buy: number;
  sell: number;
  gold_content: string;
  kara_content: string;
  updated_at: string;
}

function getDynamicField(item: BtmcRawItem, prefix: string): string {
  // Handle both JSON format (@prefix) and XML format (prefix)
  const entry = Object.entries(item).find(
    ([key]) => key.startsWith(`@${prefix}`) || key.startsWith(prefix),
  );
  return typeof entry?.[1] === "string" ? entry[1] : "";
}

// ── BTMC target products (gold & silver) ──
interface BtmcProductCategory {
  type: "gold" | "silver";
  test: (name: string) => boolean;
}

const BTMC_PRODUCTS: BtmcProductCategory[] = [
  // ── Gold ──
  {
    type: "gold",
    test: (n) =>
      /VÀNG.*MIẾNG/i.test(n) &&
      (/VRTL/i.test(n) || /RỒNG.*THĂNG.*LONG/i.test(n)) &&
      !/SJC/i.test(n),
  },
  {
    type: "gold",
    test: (n) => /NHẪN.*TRÒN.*TRƠN/i.test(n),
  },
  {
    type: "gold",
    test: (n) => /QU[ÀA].*MỪNG/i.test(n),
  },
  {
    type: "gold",
    test: (n) => /VÀNG.*MIẾNG.*SJC/i.test(n),
  },
  {
    type: "gold",
    test: (n) => /TRANG.*SỨC.*RỒNG.*THĂNG.*LONG.*999\.9/i.test(n),
  },
  {
    type: "gold",
    test: (n) =>
      /TRANG.*SỨC.*RỒNG.*THĂNG.*LONG.*99\.9/i.test(n) && !/999\.9/.test(n),
  },
  // ── Silver — Bạc Rồng Thăng Long ──
  {
    type: "silver",
    test: (n) => /BẠC.*RỒNG.*THĂNG.*LONG.*1\s+LƯỢNG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /BẠC.*RỒNG.*THĂNG.*LONG.*5\s+LƯỢNG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /BẠC.*RỒNG.*THĂNG.*LONG.*0[,.]5\s*KG/i.test(n),
  },
  {
    type: "silver",
    test: (n) =>
      /BẠC.*RỒNG.*THĂNG.*LONG.*1\s+KG/i.test(n) && !/0[,.]5/i.test(n),
  },
  // ── Silver — Phú Quý ──
  {
    type: "silver",
    test: (n) => /PHÚ.*QU[ÝY].*1\s+LƯỢNG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /PHÚ.*QU[ÝY].*5\s+LƯỢNG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /PHÚ.*QU[ÝY].*1\s+KG/i.test(n),
  },
  // ── Silver — Ancarat ──
  {
    type: "silver",
    test: (n) => /SƯ.*TỬ.*ANCARAT/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /ANCARAT.*10\s+LƯỢNG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /ANCARAT.*0[,.]5\s*KG/i.test(n),
  },
  {
    type: "silver",
    test: (n) => /ANCARAT.*1\s+KG/i.test(n),
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
// /api/gold  –  proxy to VNAppMob Gold API & BTMC
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

        // Normalize every record
        const normalized: BtmcNormalizedItem[] = records
          .map((record) => {
            const name = getDynamicField(record, "n_").trim();
            const buy = Number.parseInt(getDynamicField(record, "pb_"), 10);
            const sell = Number.parseInt(getDynamicField(record, "ps_"), 10);
            const gold_content = getDynamicField(record, "h_").trim();
            const kara_content = getDynamicField(record, "k_").trim();
            const updated_at = getDynamicField(record, "d_").trim();

            return {
              name,
              buy: Number.isNaN(buy) ? 0 : buy,
              sell: Number.isNaN(sell) ? 0 : sell,
              gold_content,
              kara_content,
              updated_at,
            };
          })
          .filter(
            (item) =>
              item.name.length > 0 &&
              (item.buy > 0 || item.sell > 0) &&
              item.updated_at.length > 0,
          );

        // Sort newest first to avoid empty gold array when silver has newer timestamp
        const sortedByTime = [...normalized].sort((a, b) => {
          return (
            parseBtmcDateToTimestamp(b.updated_at) -
            parseBtmcDateToTimestamp(a.updated_at)
          );
        });

        // Match products into gold & silver arrays
        const gold: Array<{
          name: string;
          gold_content: string;
          kara_content: string;
          buy: number;
          sell: number;
          updated_at: string;
        }> = [];
        const silver: Array<{
          name: string;
          buy: number;
          sell: number;
          updated_at: string;
        }> = [];
        const matched = new Set<number>();

        for (const cat of BTMC_PRODUCTS) {
          const idx = sortedByTime.findIndex(
            (item, i) => !matched.has(i) && cat.test(item.name),
          );
          if (idx === -1) continue;
          matched.add(idx);
          const item = sortedByTime[idx];

          if (cat.type === "gold") {
            gold.push({
              name: item.name,
              gold_content: item.gold_content,
              kara_content: item.kara_content,
              buy: item.buy,
              sell: item.sell,
              updated_at: item.updated_at,
            });
          } else {
            silver.push({
              name: item.name,
              buy: item.buy,
              sell: item.sell,
              updated_at: item.updated_at,
            });
          }
        }

        res.setHeader("Cache-Control", "public, max-age=300");
        res.status(200).json({ gold, silver });
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
