"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loadGame, saveGame } from "@/lib/gameStorage";
import { createInitialMembers, Member, ChatMessage, GameState } from "@/data/members";
import { concepts } from "@/data/concepts";
import { applyStatDelta } from "@/lib/applyStatDelta";
import { evaluateEnding } from "@/lib/evaluateEnding";
import ChatBubble from "@/components/ChatBubble";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import StatBar from "@/components/StatBar";
import Modal from "@/components/Modal";

const CHAT_LIMIT = 5;

export default function ChatPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(createInitialMembers());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [extraChats, setExtraChats] = useState(0);
  const [openingShown, setOpeningShown] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const MEMBER_ID = "A";
  const currentMember = members.find(m => m.id === MEMBER_ID);
  const conceptId = gameState?.selectedMissionId ?? "soft-savior";
  const concept = concepts[conceptId];

  // Load game & show opening message once
  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
      return;
    }
    setGameState(saved);
    setMembers(saved.members);
    setChatHistory(saved.chatHistory);
    setExtraChats(saved.extraChats ?? 0);

    // Auto-show opening message on first entry
    if (saved.chatHistory.length === 0) {
      const c = concepts[saved.selectedMissionId ?? "soft-savior"];
      if (c) {
        const opening: ChatMessage = {
          memberId: "A",
          role: "assistant",
          message: c.openingMessage,
        };
        setChatHistory([opening]);
        setOpeningShown(true);
      }
    }
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const effectiveLimit = CHAT_LIMIT + extraChats;
  const userTurnCount = chatHistory.filter(c => c.role === "user").length;
  const remaining = effectiveLimit - userTurnCount;
  const endingStatus = currentMember ? evaluateEnding(currentMember.stats, userTurnCount) : null;

  const saveChat = useCallback((history: ChatMessage[]) => {
    const saved = loadGame();
    if (!saved) return;
    saved.chatHistory = history;
    saveGame(saved);
    setChatHistory(history);
  }, []);

  const handlePurchase = () => {
    const saved = loadGame();
    if (!saved) return;
    const updated = { ...saved, extraChats: (saved.extraChats ?? 0) + 5 };
    saveGame(updated);
    setExtraChats(updated.extraChats);
    setShowPurchaseModal(false);
  };

  const handleSend = async (msg: string) => {
    if (!msg.trim() || isLoading) return;
    if (userTurnCount >= effectiveLimit) return;

    const userMsg: ChatMessage = { memberId: MEMBER_ID, role: "user", message: msg };
    const updated = [...chatHistory, userMsg];
    saveChat(updated);
    setInput("");
    setIsLoading(true);

    try {
      const currentStats = currentMember?.stats ?? { popularity: 50, affection: 50, jealousy: 50, mental: 50 };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: MEMBER_ID,
          userMessage: msg,
          selectedMissionId: conceptId,
          currentStats,
          chatHistory: updated,
          characterName: currentMember?.name ?? "멤버 A",
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const replyMsg: ChatMessage = { memberId: MEMBER_ID, role: "assistant", message: data.reply };
      const finalHistory = [...updated, replyMsg];
      saveChat(finalHistory);

      // Apply statDelta to member A
      if (data.statDelta && currentMember) {
        const newStats = applyStatDelta(currentMember.stats, data.statDelta);
        const updatedMembers = members.map(m => m.id === "A" ? { ...m, stats: newStats } : m);
        setMembers(updatedMembers);
        const saved = loadGame();
        if (saved) {
          saved.members = updatedMembers;
          saveGame(saved);
          setGameState(saved);
        }
      }
    } catch {
      const replyMsg: ChatMessage = { memberId: MEMBER_ID, role: "assistant", message: "음… 아직 잘 모르겠어요. 그래도 디렉터님이 그렇게 말해주니까, 조금은 버텨볼 수 있을 것 같아요." };
      saveChat([...updated, replyMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const isForced = userTurnCount >= effectiveLimit;

  const getEndingButtonText = () => {
    if (!endingStatus) return "엔딩 확인하기";
    switch (endingStatus.status) {
      case "LOCKED": return "엔딩 확인하기";
      case "NORMAL_READY": return "엔딩 확인하기";
      case "HAPPY_READY": return "해피 엔딩 확인하기";
      case "BAD_READY": return "배드 엔딩 확인하기";
      case "FORCED": return "최종 엔딩 확인하기";
      default: return "엔딩 확인하기";
    }
  };

  const getEndingHint = () => {
    if (!endingStatus) return null;
    switch (endingStatus.status) {
      case "LOCKED": return "최소 3번 이상 대화해야 엔딩을 볼 수 있어요";
      case "NORMAL_READY": return "현재 관계 상태로 엔딩을 생성합니다";
      case "HAPPY_READY": return "도하가 마음을 열었습니다";
      case "BAD_READY": return "도하의 감정이 위험 상태입니다";
      case "FORCED": return "오늘의 AI TALK를 모두 사용했습니다";
      default: return null;
    }
  };

  const handleEndingClick = () => {
    if (endingStatus?.status === "LOCKED") return;
    localStorage.setItem("mvp-ending-status", JSON.stringify({
      endingType: endingStatus?.endingType ?? "HAPPY",
      finalStats: currentMember?.stats,
      selectedMissionId: conceptId,
      chatHistory: chatHistory.slice(-20),
      userTurnCount,
      characterName: currentMember?.name ?? "멤버 A",
    }));
    router.push("/ending");
  };

  const suggestedQuestions = concept?.suggestedQuestions ?? [];

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center space-y-2 mb-6">
          <Badge>AI CHAT</Badge>
          <p className="text-body-sm text-text-secondary">
            오늘의 AI TALK {userTurnCount}/{effectiveLimit}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            {currentMember && (
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border overflow-hidden shrink-0 flex items-center justify-center text-body-sm font-bold text-text-muted">
                  <img src={currentMember.imageUrl} alt={currentMember.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-label-md text-text-primary">{currentMember.name}</p>
                  <p className="text-body-sm text-text-muted">{currentMember.role}</p>
                </div>
              </div>
            )}

            <div className="bg-surface border border-border rounded-xl p-5 space-y-4 h-[400px] overflow-y-auto">
              {chatHistory.length === 0 && !openingShown ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-3">
                  <p className="text-body-sm">아래 질문을 선택하거나 메시지를 입력하세요</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 text-body-sm bg-surface-elevated text-text-muted rounded-full hover:bg-surface-soft transition"
                        disabled={isForced}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, i) => {
                  const isFirst = i === 0 || chatHistory[i - 1].role !== chat.role;
                  return (
                    <ChatBubble
                      key={i}
                      message={chat.message}
                      role={chat.role}
                      isFirst={isFirst}
                      senderName={chat.role === "assistant" ? currentMember?.name : undefined}
                      senderInitial={chat.role === "assistant" ? currentMember?.name[0] : undefined}
                      senderAvatarUrl={chat.role === "assistant" ? currentMember?.imageUrl : undefined}
                    />
                  );
                })
              )}
              {isLoading && (
                <div className="flex gap-2 items-end">
                  <div className="w-[34px] h-[34px] rounded-full bg-surface-soft border border-border shrink-0 flex items-center justify-center text-xs font-bold text-text-muted">
                    {currentMember?.name[0] ?? "?"}
                  </div>
                  <div className="relative">
                    <div className="px-4 py-3 text-sm leading-relaxed bg-surface-elevated text-text-muted rounded-xl rounded-bl-sm animate-pulse">
                      대기실에서 답장을 입력 중...
                    </div>
                    <div className="absolute -left-[6px] bottom-[10px] w-0 h-0 border-r-[6px] border-r-surface-elevated border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {!isForced ? (
              <div className="space-y-2">
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
                {chatHistory.length > 0 && suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 text-xs bg-surface-elevated text-text-muted rounded-full hover:bg-surface-soft transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-body-sm text-text-muted">모든 대화를 사용했습니다.</p>
                <Button onClick={() => setShowPurchaseModal(true)}>
                  AI 채팅권 구매하기 (₩3,900)
                </Button>
              </div>
            )}

            <div className="flex flex-col items-center gap-1 pt-2">
              <Button
                variant={endingStatus?.status === "HAPPY_READY" ? "primary" : "secondary"}
                onClick={handleEndingClick}
                className={endingStatus?.status === "LOCKED" ? "opacity-50 cursor-not-allowed" : ""}
              >
                {getEndingButtonText()}
              </Button>
              {getEndingHint() && (
                <p className="text-[0.65rem] text-text-muted">{getEndingHint()}</p>
              )}
            </div>
          </div>

          <div className="lg:w-56 space-y-3 pl-[5px]">
            {currentMember && (
              <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                <p className="text-label-caps text-text-muted uppercase">스탯</p>
                <p className="text-label-md text-text-primary">{currentMember.name}</p>
                <StatBar label="POPULARITY" value={currentMember.stats.popularity} color="popularity" height="h-1.5" />
                <StatBar label="AFFECTION" value={currentMember.stats.affection} color="affection" height="h-1.5" />
                <StatBar label="JEALOUSY" value={currentMember.stats.jealousy} color="jealousy" height="h-1.5" />
                <StatBar label="MENTAL" value={currentMember.stats.mental} color="mental" height="h-1.5" />
              </div>
            )}
            {concept && (
              <div className="bg-surface border border-border rounded-xl p-3">
                <p className="text-label-caps text-text-muted uppercase pl-1">콘셉트</p>
                <p className="text-body-sm text-text-primary mt-1 pl-1">{concept.label}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} title="AI 채팅권 구매">
        <div className="space-y-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-elevated border border-border flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <div className="space-y-2">
            <p className="text-body-md text-text-primary font-semibold">AI 채팅권</p>
            <p className="text-body-sm text-text-muted">멤버와의 추가 대화 5회가 충전됩니다.</p>
          </div>
          <div className="bg-surface-elevated rounded-xl p-4">
            <p className="text-heading-md text-primary">₩3,900</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePurchase} className="flex-1">
              ₩3,900 결제하고 5회 충전
            </Button>
            <Button variant="secondary" onClick={() => setShowPurchaseModal(false)}>
              취소
            </Button>
          </div>
          <p className="text-body-sm text-text-muted">
            * 현재 테스트 단계로 실제 결제 없이 바로 충전됩니다.
          </p>
        </div>
      </Modal>
    </main>
  );
}
