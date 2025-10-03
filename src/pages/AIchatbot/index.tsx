import { AI_MODELS } from "./variables";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Loader2, Send } from "lucide-react";
import React, { useEffect, useRef, useState, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    (typeof AI_MODELS)[number]["id"]
  >(AI_MODELS[0].id);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isLoading, messages.length]);

  const handleNewChat = () => {
    setMessages([]);
  };

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
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://tforart.vn/",
            "X-Title": "AI Chatbot",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.choices[0]?.message?.content ||
          "Sorry, I couldn't get a response.",
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

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  return (
    <Layout>
      <div className="privacy-policy-container max-w-full sm:max-w-[1200px] px-2 sm:px-5 pt-[70px] sm:pt-[100px] lg:pt-[150px] mx-auto">
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className="text-lg sm:text-2xl font-semibold text-center">
            TFORART&apos;s AI Chatbot <span className="font-light">(Beta)</span>
          </h1>
          <div className="flex gap-3 items-center justify-center">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-48 px-3 py-1.5 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              disabled={isLoading}
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNewChat}
              title="New Chat"
            >
              <ReloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2 mb-3 sm:mb-5">
          (Model AI sử dụng là các phiên bản miễn phí từ OpenRouter.ai, có thể
          giới hạn một số chức năng nâng cao)
        </p>

        {/* generate questions area */}
        <section className="flex flex-col h-[calc(100vh-250px)] relative">
          {messages.length > 0 && (
            <ScrollArea
              ref={scrollAreaRef}
              className="p-3 md:p-4 h-[calc(100vh-320px)] md:h-[calc(100vh-350px)] border-t border-gray-700 mb-3 sm:mb-5"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 sm:mb-4 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 text-sm sm:text-base ${
                      msg.role === "user" ? "bg-blue-600" : "bg-gray-800"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h3: ({ ...props }: ComponentProps<"h3">) => (
                            <h3
                              className="text-base sm:text-lg font-semibold mt-2 mb-1 sm:mt-4 sm:mb-2"
                              {...props}
                            />
                          ),
                          strong: ({ ...props }: ComponentProps<"strong">) => (
                            <strong className="font-bold" {...props} />
                          ),
                          ul: ({ ...props }: ComponentProps<"ul">) => (
                            <ul
                              className="list-disc pl-4 sm:pl-5 my-1 sm:my-2"
                              {...props}
                            />
                          ),
                          ol: ({ ...props }: ComponentProps<"ol">) => (
                            <ol
                              className="list-decimal pl-4 sm:pl-5 my-1 sm:my-2"
                              {...props}
                            />
                          ),
                          li: ({ ...props }: ComponentProps<"li">) => (
                            <li className="my-1 pl-1 sm:pl-2" {...props} />
                          ),
                          hr: ({ ...props }: ComponentProps<"hr">) => (
                            <hr
                              className="border-gray-600 my-2 sm:my-4"
                              {...props}
                            />
                          ),
                          p: ({ ...props }: ComponentProps<"p">) => (
                            <p className="my-1 sm:my-2" {...props} />
                          ),
                          table: ({ ...props }: ComponentProps<"table">) => (
                            <table
                              className="w-full border-collapse border border-gray-600 my-2 sm:my-4"
                              {...props}
                            />
                          ),
                          th: ({ ...props }: ComponentProps<"th">) => (
                            <th
                              className="border border-gray-600 p-1 sm:p-2 bg-gray-700"
                              {...props}
                            />
                          ),
                          td: ({ ...props }: ComponentProps<"td">) => (
                            <td
                              className="border border-gray-600 p-1 sm:p-2"
                              {...props}
                            />
                          ),
                          br: ({ ...props }: ComponentProps<"br">) => (
                            <br {...props} />
                          ),
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

              {/* loading effect*/}
              {isLoading && (
                <div className="mb-2 sm:mb-4 flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-2 sm:p-3 bg-gray-800 flex items-center gap-2 text-sm sm:text-base">
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0s]"></span>
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="block w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-2 text-gray-400">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          )}

          {/* input prompt */}
          <div
            className={`flex w-full gap-2 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-[bottom] duration-500 ease-in-out ${
              messages.length > 0
                ? "bottom-[-20px]"
                : "bottom-[60%] sm:bottom-[50%]"
            }`}
          >
            <div className="relative flex-1">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 h-14 sm:h-20 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 pr-16 transition-all duration-200 text-sm sm:text-base"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => void handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed h-10 w-10 sm:h-12 sm:w-12 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AIChatbot;
