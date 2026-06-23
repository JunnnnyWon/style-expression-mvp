"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGame, saveGame } from "@/lib/gameStorage";
import { missions } from "@/data/missions";
import { createInitialMembers } from "@/data/members";
import { applyMission } from "@/lib/applyMission";
import MissionCard from "@/components/MissionCard";
import Badge from "@/components/Badge";
import type { Member } from "@/data/members";

export default function MissionPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(createInitialMembers());

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
    const updated = applyMission(saved, mission);
    saveGame(updated);
    router.push(`/result?mission=${missionId}`);
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge>MISSION 01</Badge>
          <h2 className="text-[2.5rem] font-display font-extrabold leading-[1.05] tracking-[-0.04em]">
            첫 컴백 무대 콘셉트를 결정하세요
          </h2>
          <p className="text-text-secondary">선택이 서사를 바꿉니다</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {missions.map(mission => (
            <MissionCard key={mission.id} mission={mission} members={members} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </main>
  );
}
