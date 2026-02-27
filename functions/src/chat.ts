import { setCors } from "./cors";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

const openrouterApiKey = defineSecret("OPENROUTER_API_KEY");

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
