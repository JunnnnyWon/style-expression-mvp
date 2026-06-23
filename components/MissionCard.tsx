"use client";

import { Mission, Member } from "@/data/members";
import { useState } from "react";
import Badge from "./Badge";

export default function MissionCard({
  mission,
  members,
  onSelect,
  selected,
}: {
  mission: Mission;
  members: Member[];
  onSelect: (id: string) => void;
  selected?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const mainEffect = mission.effects[0];
  const targetMember = mainEffect ? members.find(m => m.id === mainEffect.memberId) : null;

  return (
    <div
      className={`bg-surface border rounded-xl overflow-hidden transition-all duration-150 cursor-pointer group ${
        selected
          ? "border-primary"
          : "border-border hover:border-border-strong hover:-translate-y-1"
      }`}
      style={selected ? { boxShadow: '0 0 0 1px rgba(242,65,143,0.55), 0 0 36px rgba(242,65,143,0.18)' } : undefined}
      onClick={() => onSelect(mission.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(mission.id); } }}
    >
      <div className="aspect-[9/16] bg-surface-elevated overflow-hidden relative">
        {!imgError ? (
          <img
            src={mission.posterUrl}
            alt={`${mission.title} 콘셉트 포스터`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-soft to-surface">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
                <span className="text-2xl">
                  {mission.id === "runway-crush" ? "💎" : mission.id === "dark-dopamine" ? "🖤" : "✨"}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-2">포스터 로딩 실패</p>
            </div>
          </div>
        )}
        {selected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="text-ink text-xs font-bold">✓</span>
          </div>
        )}
      </div>
      <div className="p-5 space-y-3">
        <h3 className="text-heading-md text-text-primary">{mission.title}</h3>
        <p className="text-sm text-text-secondary">{mission.description}</p>
        <div className="flex flex-wrap gap-1 text-xs">
          {mission.visualKeyword.split(", ").map((kw, i) => (
            <span key={i} className="px-2 py-0.5 bg-surface-elevated text-text-muted rounded-full">{kw}</span>
          ))}
        </div>
        {targetMember && (
          <div className="bg-surface-elevated/50 rounded-xl p-3 text-sm space-y-1">
            <p className="text-text-muted text-xs font-bold tracking-[0.08em] uppercase">주요 효과</p>
            <p className="text-success">{targetMember.name} — 인기 +{mainEffect.popularity ?? 0}</p>
            {mission.effects.slice(1).map((eff, i) => {
              const m = members.find(m => m.id === eff.memberId);
              if (!m) return null;
              const parts: string[] = [];
              if (eff.jealousy && eff.jealousy > 0) parts.push(`질투 +${eff.jealousy}`);
              if (eff.affection && eff.affection < 0) parts.push(`애정 ${eff.affection}`);
              if (eff.mental && eff.mental < 0) parts.push(`멘탈 ${eff.mental}`);
              if (eff.popularity && eff.popularity < 0) parts.push(`인기 ${eff.popularity}`);
              return (
                <p key={i} className="text-text-muted text-xs">
                  {m.name} — {parts.join(", ")}
                </p>
              );
            })}
          </div>
        )}
        <div className="flex justify-between text-xs text-text-muted pt-2 border-t border-border">
          <span className="text-success">화제성 +{mission.groupEffect.fame}</span>
          <span className="text-warning">스캔들 위험 +{mission.groupEffect.scandalRisk}</span>
        </div>
      </div>
    </div>
  );
}
