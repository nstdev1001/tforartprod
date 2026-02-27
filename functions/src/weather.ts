import { setCors } from "./cors";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

const weatherApiKey = defineSecret("WEATHER_API_KEY");

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
