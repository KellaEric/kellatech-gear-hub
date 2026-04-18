import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "kellas-assistant-history";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm **Kella**, your KellasTech assistant 👋\n\nI can help you find the right product, check your order status, or answer questions about our IT services. What are you looking for today?",
};

const SUGGESTIONS = [
  "Show me your laptops",
  "What's the cheapest monitor?",
  "Where is my last order?",
  "Do you install CCTV cameras?",
];

const AssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [WELCOME];
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist conversation locally.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Autoscroll on new content.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/assistant-chat`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      };
      if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
      else headers.Authorization = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;

      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok || !resp.body) {
        let msg = "Assistant is unavailable right now.";
        try {
          const j = await resp.json();
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        if (resp.status === 429) msg = "Too many messages — give it a moment and try again.";
        if (resp.status === 402) msg = "AI usage limit reached. Please contact support.";
        throw new Error(msg);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantText = "";
      let done = false;

      const pushDelta = (delta: string) => {
        assistantText += delta;
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { ...last, content: assistantText };
          }
          return copy;
        });
      };

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) pushDelta(content);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }

      if (assistantText.trim() === "") {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Hmm, I didn't catch that. Could you rephrase?",
          };
          return copy;
        });
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Something went wrong.";
      toast.error(errorMsg);
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          copy[copy.length - 1] = { role: "assistant", content: `⚠️ ${errorMsg}` };
        }
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-2 pl-3 pr-4 py-3 gradient-primary text-primary-foreground rounded-full glow-primary-lg hover:scale-105 transition-transform"
        >
          <span className="relative flex w-9 h-9 items-center justify-center rounded-full bg-background/20">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-primary animate-pulse" />
          </span>
          <span className="hidden sm:inline font-bold text-sm">Ask Kella</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[620px] sm:max-h-[calc(100vh-3rem)] bg-card sm:rounded-2xl border border-primary/20 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="gradient-primary px-4 py-3 flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 rounded-full bg-background/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm leading-tight">Kella Assistant</p>
                <p className="text-[11px] opacity-90 leading-tight">Ask about products, orders & services</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={resetChat}
                className="text-[11px] font-semibold px-2 py-1 rounded-md bg-background/15 hover:bg-background/25 transition-colors"
                aria-label="Reset chat"
              >
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1.5 rounded-md hover:bg-background/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-primary/15 text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
                      {m.content === "" && loading ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
                        </span>
                      ) : (
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => {
                              const isInternal = href && href.startsWith("/");
                              if (isInternal) {
                                return (
                                  <Link
                                    to={href}
                                    onClick={() => setOpen(false)}
                                    className="text-primary font-semibold hover:underline"
                                  >
                                    {children}
                                  </Link>
                                );
                              }
                              return (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-primary font-semibold hover:underline"
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !loading && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[11px] px-2.5 py-1.5 rounded-full border border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form onSubmit={handleSubmit} className="border-t border-primary/15 bg-card p-2 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about KellasTech..."
              rows={1}
              className="flex-1 resize-none bg-muted border border-primary/20 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary max-h-32"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 shrink-0 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
              aria-label="Send"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AssistantWidget;
