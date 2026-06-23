"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGame, saveGame } from "@/lib/gameStorage";
import { missions } from "@/data/missions";
import { createInitialMembers } from "@/data/members";
import { applyMission } from "@/lib/applyMission";
import { concepts } from "@/data/concepts";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import type { Member, Mission } from "@/data/members";

export default function MissionPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(createInitialMembers());
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
    } else {
      setMembers(saved.members);
    }
  }, [router]);

  const handleSelect = (missionId: string) => {
    const saved = loadGame();
    if (!saved) return;
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    const concept = concepts[missionId];
    if (concept) {
      const memberA = saved.members.find(m => m.id === "A");
      if (memberA) {
        memberA.stats = { ...concept.initialStats };
      }
    }
    const updated = applyMission(saved, mission);
    saveGame(updated);
    router.push(`/result?mission=${missionId}`);
  };

  return (
    <main className="min-h-screen px-6 py-12 flex flex-col justify-center">
      <div className="max-w-[1000px] mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <Badge>MISSION 01</Badge>
          <h2 className="text-display-lg">
            첫 컴백 무대 콘셉트를 결정하세요
          </h2>
          <p className="text-body-md text-text-secondary">포스터를 클릭하여 세부 정보를 확인하고 선택하세요</p>
        </div>

        {/* 3 Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center pt-4">
          {missions.map((mission, idx) => (
            <div
              key={mission.id}
              onClick={() => {
                setSelectedMission(mission);
                setIsModalOpen(true);
              }}
              className="relative w-full max-w-[290px] aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group border border-border/40 hover:border-primary/80 transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1.5"
              style={{
                boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedMission(mission);
                  setIsModalOpen(true);
                }
              }}
            >
              <img
                src={mission.posterUrl}
                alt={mission.title}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              {/* Bottom text overlays */}
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1">
                <span className="text-[10px] font-extrabold text-primary tracking-widest block uppercase">
                  Concept 0{idx + 1}
                </span>
                <h3 className="text-heading-md text-text-primary group-hover:text-primary-hover transition-colors leading-tight">
                  {mission.title}
                </h3>
                <p className="text-[11px] text-text-muted line-clamp-1">
                  {mission.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedMission && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="컴백 콘셉트 세부 기획안"
        >
          <div className="flex flex-col md:flex-row gap-6 text-left">
            {/* Left: Poster preview inside modal */}
            <div className="w-full md:w-[200px] shrink-0 aspect-[9/16] rounded-xl overflow-hidden border border-border bg-black/40 shadow-inner">
              <img
                src={selectedMission.posterUrl}
                alt={selectedMission.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Concept metadata details */}
            <div className="flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-heading-lg text-text-primary leading-tight">
                    {selectedMission.title}
                  </h4>
                  <p className="text-body-md text-text-secondary mt-1">
                    {selectedMission.description}
                  </p>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedMission.visualKeyword.split(", ").map((kw, i) => (
                    <Badge key={i} variant="muted">
                      {kw}
                    </Badge>
                  ))}
                </div>

                {/* Stat impact box */}
                <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
                  <p className="text-[10px] font-extrabold text-text-muted tracking-wider uppercase">
                    예상 피드백 & 감정 지표 변화
                  </p>
                  
                  {/* General Fame & Scandal metrics */}
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border text-sm">
                    <div>
                      <span className="text-text-muted text-xs block">그룹 화제성</span>
                      <span className="text-success font-bold">+{selectedMission.groupEffect.fame}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-xs block">스캔들 위험도</span>
                      <span className="text-warning font-bold">+{selectedMission.groupEffect.scandalRisk}</span>
                    </div>
                  </div>

                  {/* Character specific metrics */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    {selectedMission.effects.map((eff, i) => {
                      const m = members.find(member => member.id === eff.memberId);
                      if (!m) return null;
                      
                      const deltas: string[] = [];
                      if (eff.popularity && eff.popularity > 0) deltas.push(`인기 +${eff.popularity}`);
                      if (eff.jealousy && eff.jealousy > 0) deltas.push(`질투 +${eff.jealousy}`);
                      if (eff.affection && eff.affection < 0) deltas.push(`애정 ${eff.affection}`);
                      if (eff.mental && eff.mental < 0) deltas.push(`멘탈 ${eff.mental}`);
                      
                      if (deltas.length === 0) return null;
                      
                      const isMain = i === 0;
                      return (
                        <div key={i} className="flex justify-between items-center py-0.5">
                          <span className="font-bold text-text-secondary">{m.name}</span>
                          <span className={isMain ? "text-success font-semibold" : "text-text-muted"}>
                            {deltas.join(", ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleSelect(selectedMission.id);
                    setIsModalOpen(false);
                  }}
                >
                  이 콘셉트로 컴백 디렉팅 시작하기
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
