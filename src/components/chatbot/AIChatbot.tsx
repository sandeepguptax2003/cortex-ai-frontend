"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api/client";
import { useAuth } from "@/context/AuthContext";
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  LogIn,
} from "lucide-react";
import Link from "next/link";

// Inline renderer: **bold**, [link](/path), plain text
function renderInline(text: string, key?: string | number): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${key}-${i}`} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const isInternal = linkMatch[2].startsWith("/");
      if (isInternal) {
        return (
          <Link key={`${key}-${i}`} href={linkMatch[2]} className="text-violet-600 font-medium hover:underline underline-offset-2">
            {linkMatch[1]}
          </Link>
        );
      }
      return (
        <a key={`${key}-${i}`} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-violet-600 font-medium hover:underline underline-offset-2">
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

function renderMarkdown(content: string): React.ReactNode {
  const elements: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} className="my-2 p-3 bg-slate-800 text-slate-100 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
          {codeLines.join("\n")}
        </pre>
      );
      i++; // skip closing ```
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      elements.push(<hr key={`hr-${i}`} className="my-2 border-slate-200" />);
      i++;
      continue;
    }

    // Bullet
    if (line.match(/^[•\-\*]\s/)) {
      elements.push(
        <div key={`b-${i}`} className="flex gap-2 items-start">
          <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
          <span className="flex-1">{renderInline(line.replace(/^[•\-\*]\s/, ""), `b-${i}`)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      elements.push(
        <div key={`n-${i}`} className="flex gap-2 items-start">
          <span className="font-bold text-violet-600 flex-shrink-0 min-w-[18px] text-xs mt-0.5">{numMatch[1]}.</span>
          <span className="flex-1">{renderInline(numMatch[2], `n-${i}`)}</span>
        </div>
      );
      i++;
      continue;
    }

    // Empty line → spacing
    if (line.trim() === "") {
      if (i > 0 && i < lines.length - 1) {
        elements.push(<div key={`sp-${i}`} className="h-1" />);
      }
      i++;
      continue;
    }

    // Plain paragraph
    elements.push(
      <div key={`p-${i}`} className="leading-relaxed">{renderInline(line, `p-${i}`)}</div>
    );
    i++;
  }

  return <div className="space-y-1 text-[13px]">{elements}</div>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const GUEST_QUESTIONS = [
  { id: "1", text: "What is Cortex AI?" },
  { id: "2", text: "How does meeting AI work?" },
  { id: "3", text: "What features are available?" },
  { id: "4", text: "How do I get started?" },
];

const AUTH_QUESTIONS = [
  { id: "1", text: "What tickets are overdue?" },
  { id: "2", text: "Show team analytics" },
  { id: "3", text: "Create a new ticket for website bug" },
  { id: "4", text: "Summarize my meetings today" },
];

const CORTEX_KNOWLEDGE: Record<string, string> = {
  default: `Cortex AI is an AI-powered team collaboration platform that automatically extracts action items from your meetings, assigns owners, sets deadlines, and tracks progress — all in real time. Works with Zoom, Google Meet, and Teams via a Chrome Extension.`,
  features: `Cortex AI includes:\n• **AI Meeting Assistant** — records and extracts tasks from live meetings\n• **Smart Board** — Kanban-style ticket tracking with AI auto-assignment\n• **Team Management** — invite members, set roles (Admin / Manager / Member)\n• **Analytics** — real-time productivity insights\n• **Slack Integration** — notifications and updates\n• **Chrome Extension** — captures live captions automatically`,
  howItWorks: `1. Start a meeting and enable the Chrome Extension\n2. Cortex AI listens and extracts action items in real time\n3. Tasks appear on your Board automatically with assignees and deadlines\n4. Track progress, drag tickets across columns, and get analytics\n5. Your team stays aligned without any manual note-taking`,
  getStarted: `Getting started is simple:\n1. Create a free account at cortexai.app/signup\n2. Set up your organization and invite your team\n3. Install the Chrome Extension from the Web Store\n4. Start your first meeting — AI does the rest\n\nNo credit card required.`,
  pricing: `Cortex AI is free to use. No subscription, no hidden fees. Built for teams of all sizes.`,
};

function guestReply(message: string): string {
  const msg = message.toLowerCase();

  const authKeywords = [
    "ticket", "task", "board", "analytics", "meeting", "transcript",
    "create", "assign", "deadline", "my team", "overdue", "summarize",
    "update", "delete", "invite", "member", "slack",
  ];
  if (authKeywords.some((k) => msg.includes(k))) {
    return `That feature requires you to be signed in.\n\nTo access it:\n1. Go to [Sign In](/login)\n2. Create a free account at [Sign Up](/signup) if you don't have one\n3. Come back and I can help you with tickets, analytics, meetings, and more!`;
  }

  if (msg.includes("what is") || msg.includes("cortex") || msg.includes("about") || msg.includes("tell me")) {
    return CORTEX_KNOWLEDGE.default;
  }
  if (msg.includes("feature") || msg.includes("can you") || msg.includes("what can") || msg.includes("capability")) {
    return CORTEX_KNOWLEDGE.features;
  }
  if (msg.includes("how") && (msg.includes("work") || msg.includes("does it") || msg.includes("meeting"))) {
    return CORTEX_KNOWLEDGE.howItWorks;
  }
  if (msg.includes("start") || msg.includes("begin") || msg.includes("setup") || msg.includes("sign up") || msg.includes("register")) {
    return CORTEX_KNOWLEDGE.getStarted;
  }
  if (msg.includes("price") || msg.includes("pricing") || msg.includes("cost") || msg.includes("free") || msg.includes("pay")) {
    return CORTEX_KNOWLEDGE.pricing;
  }
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return `Hi there! I'm Cortex AI — your intelligent meeting assistant. I can tell you about our platform and what we do.\n\nTo access your tickets, meetings, and analytics, please [sign in](/login) or [create an account](/signup).`;
  }

  return `I can answer questions about Cortex AI — our features, how it works, pricing, and how to get started.\n\nFor your personal tickets, meetings, and analytics, please [sign in](/login) first.`;
}

export function AIChatbot() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = isAuthenticated
    ? "Hi! I'm Cortex AI. I can create tickets, show analytics, search your tasks, and more. What do you need?"
    : "Hi! I'm Cortex AI. Ask me anything about our platform. Sign in to manage your tickets and meetings.";

  useEffect(() => {
    if (!authLoading) {
      setMessages([
        { id: "welcome", role: "assistant", content: welcomeMessage, timestamp: new Date() },
      ]);
    }
  }, [isAuthenticated, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
    ]);

    try {
      let reply: string;

      if (!isAuthenticated) {
        await new Promise((r) => setTimeout(r, 400));
        reply = guestReply(text);
      } else {
        const response = await api.sendAIChatMessage(text, {
          currentPage: window.location.pathname,
          recentTickets: [],
          recentMeetings: [],
        });
        if (!response.success) throw new Error(response.message);
        reply = response.data.message;
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, content: reply, isStreaming: false } : m)
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const clearChat = () => {
    setMessages([{ id: "welcome", role: "assistant", content: welcomeMessage, timestamp: new Date() }]);
  };

  const suggestedQuestions = isAuthenticated ? AUTH_QUESTIONS : GUEST_QUESTIONS;

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/30 flex items-center justify-center hover:shadow-violet-500/50 transition-shadow"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1, height: isMinimized ? "auto" : "600px" }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Cortex AI</p>
                  <p className="text-xs text-white/70">
                    {isAuthenticated ? "Full access enabled" : "Ask me anything"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] overscroll-contain">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-violet-100 text-violet-600"
                          : "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"
                      }`}>
                        {message.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        message.role === "user" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-800"
                      }`}>
                        {message.isStreaming ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </div>
                        ) : message.role === "assistant" ? (
                          renderMarkdown(message.content)
                        ) : (
                          <span>{message.content}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />

                  {messages.length === 1 && !isLoading && (
                    <div className="pt-4">
                      <p className="text-xs text-slate-500 mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q) => (
                          <button
                            key={q.id}
                            onClick={() => handleSend(q.text)}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-violet-50 text-slate-600 hover:text-violet-600 rounded-full transition-colors text-left"
                          >
                            {q.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isAuthenticated && messages.length === 1 && (
                    <div className="pt-2">
                      <a
                        href="/login"
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 hover:text-white transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign in for full access
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isAuthenticated ? "Create ticket, check analytics..." : "Ask about Cortex AI..."}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="icon">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <button onClick={clearChat} className="text-xs text-slate-400 hover:text-slate-600">
                      Clear chat
                    </button>
                    <p className="text-xs text-slate-400">Powered by Cortex AI</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
