import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const model = "meta-llama/llama-3.3-8b-instruct:free";

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTE_API_KEY}`,
            "HTTP-Referer": "https://tforart.vn/",
            "X-Title": "AI Chatbot",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: `${model}`,
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            // stream: true,
          }),
        }
      );

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      void handleSend();
    }
  };

  return (
    <Layout>
      <div className="privacy-policy-container max-w-[1200px] p-[20px] md:p-[50px] pt-[70px] md:pt-[100px] lg:pt-[150px] mx-auto">
        <h1 className="text-2xl font-semibold text-center">AI Chatbot</h1>
        <p className="text-center text-xs text-gray-400 mb-5">
          (Tính năng đang trong quá trình phát triển)
        </p>

        {/* answer your questions with AI */}
        <section className="flex flex-col h-[800px] relative ">
          {messages.length > 0 && (
            <ScrollArea className="sm:p-6 h-[700px]">
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user" ? "bg-blue-600" : "bg-gray-800"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h3: ({ ...props }) => (
                              <h3
                                className="text-lg font-semibold mt-4 mb-2"
                                {...props}
                              />
                            ),
                            strong: ({ ...props }) => (
                              <strong className="font-bold" {...props} />
                            ),
                            ul: ({ ...props }) => (
                              <ul className="list-disc pl-5 my-2" {...props} />
                            ),
                            ol: ({ ...props }) => (
                              <ol
                                className="list-decimal pl-5 my-2"
                                {...props}
                              />
                            ),
                            li: ({ ...props }) => (
                              <li className="my-1 pl-2" {...props} />
                            ),
                            hr: ({ ...props }) => (
                              <hr className="border-gray-600 my-4" {...props} />
                            ),
                            p: ({ ...props }) => (
                              <p className="my-2" {...props} />
                            ),
                            table: ({ ...props }) => (
                              <table
                                className="w-full border-collapse border border-gray-600 my-4"
                                {...props}
                              />
                            ),
                            th: ({ ...props }) => (
                              <th
                                className="border border-gray-600 p-2 bg-gray-700"
                                {...props}
                              />
                            ),
                            td: ({ ...props }) => (
                              <td
                                className="border border-gray-600 p-2"
                                {...props}
                              />
                            ),
                            br: ({ ...props }) => <br {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <span>{msg.content}</span>
                      )}
                    </div>
                  </div>
                ))}
            </ScrollArea>
          )}

          {/* input prompt */}
          <div
            className={`flex w-full gap-2 absolute left-[50%] -translate-x-1/2 -translate-y-1/2 transition-[bottom] duration-500 ease-in-out ${
              messages.length > 0 ? "bottom-1" : "bottom-[50%]"
            }`}
          >
            <div className="relative flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-20 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 pr-16 transition-all duration-200"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed h-12 w-12 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AIChatbot;
