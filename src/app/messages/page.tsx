"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, HeartHandshake, Building2, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { mockThreads } from "@/data/providers";
import type { Thread, Message } from "@/lib/types";

export default function MessagesPage() {
  return (
    <AppShell title="Zprávy">
      <MessagesInner />
    </AppShell>
  );
}

function timeLabel(at: number) {
  const now = Date.now();
  const diff = now - at;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "právě teď";
  if (mins < 60) return `před ${mins} min`;
  if (hours < 24) return `před ${hours} h`;
  if (days < 7) return `před ${days} dny`;
  return new Date(at).toLocaleDateString("cs", { day: "numeric", month: "numeric" });
}

function fullTimeLabel(at: number) {
  return new Date(at).toLocaleString("cs", {
    day: "numeric", month: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function MessagesInner() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [activeId, setActiveId] = useState<string>(mockThreads[0]?.id ?? "");
  const [draft, setDraft] = useState("");

  const active = threads.find((t) => t.id === activeId);

  // Koordinátor vlákno vždy první
  const coordinatorThread = threads.find((t) => t.kind === "coordinator");
  const facilityThreads = threads.filter((t) => t.kind !== "coordinator");

  function send() {
    if (!draft.trim() || !active) return;
    const msg: Message = {
      id: "m" + Date.now(),
      from: "Vy",
      fromRole: "family",
      body: draft.trim(),
      at: Date.now(),
      unread: false,
    };
    setThreads((ts) =>
      ts.map((t) =>
        t.id === active.id
          ? { ...t, messages: [...t.messages, msg], lastMessageAt: msg.at }
          : t
      )
    );
    setDraft("");
  }

  function unreadCount(t: Thread) {
    return t.messages.filter((m) => m.unread).length;
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 sm:px-7">
      <h1 className="font-serif text-[1.7333rem] font-medium text-ink">Zprávy</h1>
      <p className="mt-1 text-[0.9333rem] text-ink-2 a11y-dim">
        Veškerá komunikace na jednom místě — koordinátorka i zařízení.
      </p>

      <div className="mt-5 grid h-[calc(100vh-220px)] min-h-[480px] max-h-[680px] grid-cols-1 overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft sm:grid-cols-[300px,1fr]">

        {/* ── Levý panel — thready ── */}
        <div className="flex flex-col overflow-hidden border-b border-line sm:border-b-0 sm:border-r">
          <div className="shrink-0 overflow-y-auto">

            {/* Koordinátorka — vždy nahoře */}
            {coordinatorThread && (
              <div>
                <div className="sticky top-0 z-10 bg-sage-l px-4 py-2 border-b border-sage-bd">
                  <span className="flex items-center gap-1.5 text-[0.6667rem] font-semibold uppercase tracking-wider text-sage-d">
                    <HeartHandshake size={12} /> Komunikace s koordinátorkou
                  </span>
                </div>
                <ThreadRow
                  thread={coordinatorThread}
                  active={activeId === coordinatorThread.id}
                  unread={unreadCount(coordinatorThread)}
                  onClick={() => setActiveId(coordinatorThread.id)}
                  isCoordinator
                />
              </div>
            )}

            {/* Zprávy od zařízení */}
            {facilityThreads.length > 0 && (
              <div>
                <div className="sticky top-0 z-10 bg-surface-2 px-4 py-2 border-b border-line border-t border-line">
                  <span className="flex items-center gap-1.5 text-[0.6667rem] font-semibold uppercase tracking-wider text-ink-3">
                    <Building2 size={12} /> Zprávy od zařízení · {facilityThreads.length}
                  </span>
                </div>
                {facilityThreads
                  .sort((a, b) => b.lastMessageAt - a.lastMessageAt)
                  .map((t) => (
                    <ThreadRow
                      key={t.id}
                      thread={t}
                      active={activeId === t.id}
                      unread={unreadCount(t)}
                      onClick={() => setActiveId(t.id)}
                      isCoordinator={false}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Pravý panel — konverzace ── */}
        <div className="flex min-h-0 flex-col">
          {active ? (
            <>
              {/* Hlavička konverzace */}
              <div className={`shrink-0 border-b border-line px-5 py-3 ${
                active.kind === "coordinator" ? "bg-sage-l/30" : "bg-surface"
              }`}>
                <div className="flex items-center gap-2.5">
                  {active.kind === "coordinator"
                    ? <HeartHandshake size={17} className="shrink-0 text-sage" />
                    : <Building2 size={17} className="shrink-0 text-ink-3" />
                  }
                  <div>
                    <div className="text-[0.9333rem] font-semibold text-ink">{active.providerName}</div>
                    <div className="text-[0.7333rem] text-ink-3">
                      {active.kind === "coordinator"
                        ? "Po–Pá 8–18 · Odpovídá do hodiny"
                        : "Ověřený poskytovatel péče"
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Zprávy */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {active.messages.map((m, idx) => {
                  const mine = m.fromRole === "family";
                  const isCoord = m.fromRole === "coordinator";
                  // Datum separator
                  const prevMsg = active.messages[idx - 1];
                  const showDate = !prevMsg || (new Date(m.at).toDateString() !== new Date(prevMsg.at).toDateString());

                  return (
                    <div key={m.id}>
                      {showDate && (
                        <div className="flex items-center gap-3 py-1">
                          <span className="h-px flex-1 bg-line" />
                          <span className="text-[0.7333rem] text-ink-3">
                            {new Date(m.at).toLocaleDateString("cs", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                          <span className="h-px flex-1 bg-line" />
                        </div>
                      )}
                      <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
                        {!mine && (
                          <div className={`mb-1 flex items-center gap-1.5 text-[0.7333rem] font-semibold ${
                            isCoord ? "text-sage-d" : "text-ink-3"
                          }`}>
                            {isCoord && <HeartHandshake size={11} />}
                            {m.from}
                          </div>
                        )}
                        <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 ${
                          mine
                            ? "bg-ink text-paper"
                            : isCoord
                            ? "bg-sage-l text-sage-d border border-sage-bd"
                            : "bg-surface-2 text-ink"
                        }`}>
                          <p className="text-[0.9333rem] leading-relaxed">{m.body}</p>
                        </div>
                        <span className="mt-1 text-[0.6667rem] text-ink-3" title={fullTimeLabel(m.at)}>
                          {timeLabel(m.at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Vstup */}
              <div className="shrink-0 border-t border-line p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder={active.kind === "coordinator" ? "Napište koordinátorce…" : "Napište zařízení…"}
                    className="field-input flex-1 py-2.5 text-[0.9333rem]"
                  />
                  <button
                    onClick={send}
                    disabled={!draft.trim()}
                    className="btn btn-primary h-11 w-11 rounded-full p-0 disabled:opacity-40"
                    aria-label="Odeslat"
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[0.9333rem] text-ink-3">
              <div className="text-center">
                <MessageSquare size={32} className="mx-auto mb-3 text-line-2" />
                Vyberte konverzaci
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Thread row ── */
function ThreadRow({ thread: t, active, unread, onClick, isCoordinator }: {
  thread: Thread; active: boolean; unread: number; onClick: () => void; isCoordinator: boolean;
}) {
  const last = t.messages[t.messages.length - 1];
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b border-line px-4 py-3.5 text-left transition ${
        active
          ? isCoordinator ? "bg-sage-l" : "bg-surface-2"
          : "hover:bg-surface-2"
      }`}
    >
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[0.7333rem] font-semibold ${
        isCoordinator ? "bg-sage text-white" : "bg-surface-2 text-ink-2 border border-line"
      }`}>
        {isCoordinator ? "JP" : t.providerName[0]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate text-[0.8667rem] ${unread > 0 ? "font-semibold text-ink" : "font-medium text-ink-2"}`}>
            {isCoordinator ? "Jana Procházková" : t.providerName}
          </span>
          <span className="shrink-0 text-[0.6667rem] text-ink-3">{timeLabel(t.lastMessageAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex-1 truncate text-[0.8rem] ${unread > 0 ? "text-ink-2 font-medium" : "text-ink-3"}`}>
            {last?.body}
          </span>
          {unread > 0 && (
            <span className="shrink-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-peach px-1 text-[0.6667rem] font-semibold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
