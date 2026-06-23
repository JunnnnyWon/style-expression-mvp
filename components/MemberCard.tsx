"use client";

import { Member } from "@/data/members";
import { useState } from "react";
import { ChevronDown, ChevronUp, Info, Lock } from "lucide-react";
import Badge from "./Badge";

const memberTones: Record<string, { gradient: string; accent: string }> = {
  A: { gradient: "from-amber-950/60 to-black/80", accent: "text-amber-300" },
  B: { gradient: "from-violet-950/60 to-black/80", accent: "text-violet-300" },
  C: { gradient: "from-red-950/60 to-black/80", accent: "text-red-300" },
  D: { gradient: "from-slate-950/60 to-black/80", accent: "text-slate-300" },
  E: { gradient: "from-stone-950/60 to-black/80", accent: "text-stone-300" },
};

export default function MemberCard({
  member,
  selectable,
  onDetail,
  onLockedClick,
}: {
  member: Member;
  selectable?: boolean;
  onDetail?: () => void;
  onLockedClick?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const tone = memberTones[member.id] ?? memberTones.A;
  const isSelectable = selectable ?? true;

  const handleClick = () => {
    if (!isSelectable) {
      onLockedClick?.();
      return;
    }
    setExpanded(!expanded);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`bg-surface border rounded-xl overflow-hidden transition-all duration-150 ${
        isSelectable
          ? "border-primary/50 hover:border-primary cursor-pointer"
          : "border-border cursor-not-allowed opacity-75 hover:opacity-60"
      }`}
      style={isSelectable ? { boxShadow: '0 0 0 1px rgba(242,65,143,0.25), 0 0 24px rgba(242,65,143,0.10)' } : undefined}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="aspect-[3/4] bg-surface-elevated overflow-hidden relative">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-surface-soft to-surface">
            <div className="text-center p-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-border flex items-center justify-center text-2xl font-bold text-text-muted">
                {member.name[0]}
              </div>
              <p className="text-xs text-text-muted mt-2">이미지 없음</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={member.imageUrl}
              alt={`${member.name} — ${member.role}`}
              className={`w-full h-full object-cover transition-all duration-150 ${
                !isSelectable ? "brightness-[0.9]" : ""
              }`}
              onError={() => setImgError(true)}
            />
          </>
        )}
        {!isSelectable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Lock size={28} className="mx-auto text-text-muted mb-1" />
              <p className="text-label-caps text-text-muted">COMING SOON</p>
            </div>
          </div>
        )}
        {!isSelectable && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50" />
        )}
        <div className="absolute top-2 left-2">
          <Badge variant={isSelectable ? "primary" : "muted"}>{member.id}</Badge>
        </div>
        {isSelectable && (
          <div className="absolute top-2 right-2">
            <span className="inline-block px-[8px] py-[4px] rounded-full bg-primary/90 text-ink text-[0.6rem] font-bold tracking-[0.08em]">
              SELECT
            </span>
          </div>
        )}
        {onDetail && isSelectable && (
          <button
            onClick={(e) => { e.stopPropagation(); onDetail(); }}
            className="absolute top-12 right-2 p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white transition-colors"
            aria-label="상세 정보"
          >
            <Info size={18} />
          </button>
        )}
        <div className="absolute bottom-3 left-3 right-3 space-y-1">
          <h3 className="text-heading-md text-white drop-shadow-lg">{member.name}</h3>
          <p className={`text-xs font-medium ${isSelectable ? tone.accent : "text-text-muted"} drop-shadow`}>{member.role}</p>
        </div>
      </div>
      <div className="px-3 py-3 space-y-2">
        <div className="flex flex-wrap gap-1">
          {[member.archetype, ...member.visualSummary.split(", ").slice(0, 2)].map((kw, i) => (
            <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
              isSelectable ? "bg-surface-elevated text-text-muted" : "bg-surface text-text-muted/50"
            }`}>
              {kw}
            </span>
          ))}
        </div>
        {expanded && isSelectable && (
          <div className="pt-2 space-y-2 text-sm text-text-secondary border-t border-border">
            <p>{member.personality}</p>
            <p className="text-warning/80 text-xs">{member.trigger}</p>
          </div>
        )}
        <div className="flex justify-center pt-0.5">
          {isSelectable ? (
            expanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />
          ) : null}
        </div>
      </div>
    </div>
  );
}
