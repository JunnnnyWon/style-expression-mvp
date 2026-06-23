"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadGame, saveGame } from "@/lib/gameStorage";
import { createInitialMembers, Member, ChatMessage, GameState } from "@/data/members";
import { FALLBACK_RESPONSES } from "@/lib/prompts";
import ChatBubble from "@/components/ChatBubble";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import StatBar from "@/components/StatBar";

const SUGGESTED_QUESTIONS = [
  "오늘 스타일 마음에 들어?",
  "왜 표정이 안 좋아?",
  "내가 뭘 고치면 좋을까?",
];

const CHAT_LIMIT = 3;

export default function ChatPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(createInitialMembers());
  const [selectedMember, setSelectedMember] = useState<string>("C");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
      return;
    }
    setGameState(saved);
    setMembers(saved.members);
    setChatHistory(saved.chatHistory);
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const currentMember = members.find(m => m.id === selectedMember);

  const saveChat = (history: ChatMessage[]) => {
    const saved = loadGame();
    if (!saved) return;
    saved.chatHistory = history;
    saveGame(saved);
    setChatHistory(history);
  };

  const handleSend = async (msg: string) => {
    if (!msg.trim() || isLoading) return;
    if (chatHistory.filter(c => c.role === "user").length >= CHAT_LIMIT) return;

    const userMsg: ChatMessage = { memberId: selectedMember, role: "user", message: msg };
    const updated = [...chatHistory, userMsg];
    saveChat(updated);
    setInput("");
    setIsLoading(true);

    try {
      const selectedMissionId = gameState?.selectedMissionId ?? "runway-crush";
      const currentStats = currentMember?.stats ?? { popularity: 50, affection: 50, jealousy: 50, mental: 50 };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: selectedMember,
          userMessage: msg,
          selectedMissionId,
          currentStats,
          chatHistory: updated,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const replyMsg: ChatMessage = { memberId: selectedMember, role: "assistant", message: data.reply };
      saveChat([...updated, replyMsg]);
    } catch {
      const fallbacks = FALLBACK_RESPONSES[selectedMember] ?? FALLBACK_RESPONSES["A"];
      const fallbackReply = fallbacks[updated.length % fallbacks.length];
      const replyMsg: ChatMessage = { memberId: selectedMember, role: "assistant", message: fallbackReply };
      saveChat([...updated, replyMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatCount = chatHistory.filter(c => c.role === "user").length;
  const remaining = CHAT_LIMIT - chatCount;

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center space-y-2 mb-6">
          <Badge>AI CHAT</Badge>
          <p className="text-body-sm text-text-secondary">
            오늘의 AI TALK {chatCount}/{CHAT_LIMIT}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-48 space-y-2">
            <p className="text-label-caps text-text-muted uppercase">멤버</p>
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-body-sm font-medium transition-all ${
                  selectedMember === member.id
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "bg-surface border border-border text-text-muted hover:border-border-strong"
                }`}
              >
                <div className="font-bold">{member.name}</div>
                <div className="text-xs opacity-70">{member.role}</div>
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4">
            {currentMember && (
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-body-sm font-bold text-text-muted">
                  {currentMember.name[0]}
                </div>
                <div>
                  <p className="text-label-md text-text-primary">{currentMember.name}</p>
                  <p className="text-body-sm text-text-muted">{currentMember.role}</p>
                </div>
              </div>
            )}

            <div className="bg-surface border border-border rounded-xl p-5 space-y-4 h-[400px] overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-3">
                  <p className="text-body-sm">아래 질문을 선택하거나 메시지를 입력하세요</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 text-body-sm bg-surface-elevated text-text-muted rounded-full hover:bg-surface-soft transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, i) => (
                  <ChatBubble key={i} message={chat.message} role={chat.role} />
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-elevated px-4 py-3 rounded-xl rounded-bl-md text-body-sm text-text-muted animate-pulse">
                    대기실에서 답장을 입력 중...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {remaining > 0 ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend(input)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 h-12 px-4 bg-surface-elevated border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-focus text-body-md"
                />
                <Button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}>
                  전송
                </Button>
              </div>
            ) : (
              <p className="text-center text-body-sm text-text-muted">모든 대화를 사용했습니다. 엔딩을 확인하세요.</p>
            )}

            <div className="flex justify-center pt-2">
              <Button onClick={() => router.push("/ending")}>
                엔딩 확인하기
              </Button>
            </div>
          </div>

          <div className="lg:w-56 space-y-3">
            <p className="text-label-caps text-text-muted uppercase">스탯</p>
            {currentMember && (
              <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <p className="text-label-md text-text-primary">{currentMember.name}</p>
                <StatBar label="POPULARITY" value={currentMember.stats.popularity} color="popularity" height="h-1.5" />
                <StatBar label="AFFECTION" value={currentMember.stats.affection} color="affection" height="h-1.5" />
                <StatBar label="JEALOUSY" value={currentMember.stats.jealousy} color="jealousy" height="h-1.5" />
                <StatBar label="MENTAL" value={currentMember.stats.mental} color="mental" height="h-1.5" />
              </div>
            )}
            {gameState?.selectedMissionId && (
              <div className="bg-surface border border-border rounded-xl p-3">
                <p className="text-label-caps text-text-muted uppercase">콘셉트</p>
                <p className="text-body-sm text-text-primary mt-1">{gameState.selectedMissionId.replace("-", " ").toUpperCase()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
