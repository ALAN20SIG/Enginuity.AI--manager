import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Sparkles, Plus } from "lucide-react";
import { suggestedPrompts } from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/ai-manager")({
  head: () => ({ meta: [{ title: "AI Manager — Enginuity AI" }] }),
  component: AIManager,
});

const seed: UIMessage[] = [];

function AIManager() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    id: "default",
    messages: seed,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => console.error(e),
  });

  const submit = async (text: string) => {
    if (!text.trim() || status === "submitted" || status === "streaming") return;
    await sendMessage({ text });
    setInput("");
  };

  const loading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full">
      <aside className="w-60 border-r border-border p-4 hidden lg:flex flex-col">
        <button className="flex items-center gap-2 w-full px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-md text-sm">
          <Plus className="size-4" /> New conversation
        </button>
        <div className="mt-6 space-y-1 text-sm">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 mb-2">Recent</div>
          {["Sprint Alpha Phoenix review", "Weekly exec report", "PR #833 security audit"].map((t) => (
            <button key={t} className="block w-full text-left px-3 py-2 rounded hover:bg-white/[0.03] text-muted-foreground hover:text-foreground truncate">
              {t}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-4 border-b border-border flex items-center gap-3">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Sparkles className="size-4 text-primary" />
          </div>
          <div>
            <div className="font-display font-bold">Enginuity AI Manager</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">MCP context · 7 servers · 128k tokens</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-display font-bold mb-2">How can I help you ship today?</h2>
              <p className="text-sm text-muted-foreground mb-6">Try one of these or ask anything about your engineering org.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => submit(p)}
                    className="text-left p-4 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors"
                  >
                    <div className="text-sm">{p}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>
                    {m.parts.map((p, i) => p.type === "text" ? <span key={i} className="whitespace-pre-wrap">{p.text}</span> : null)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground">Thinking…</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <form
            onSubmit={(e) => { e.preventDefault(); submit(input); }}
            className="relative max-w-3xl mx-auto"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(input); } }}
              placeholder="Ask Enginuity about your sprint, PRs, risks, team…"
              autoFocus
              className="w-full bg-secondary border border-border rounded-lg p-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 min-h-24 resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute bottom-3 right-3 p-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}