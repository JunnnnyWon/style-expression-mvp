"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadGame } from "@/lib/gameStorage";
import { createInitialMembers, Member } from "@/data/members";
import MemberCard from "@/components/MemberCard";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState(() => createInitialMembers());
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  useEffect(() => {
    const saved = loadGame();
    if (!saved) {
      router.replace("/director");
    } else {
      setMembers(saved.members);
    }
  }, [router]);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge>MEMBER PROFILE</Badge>
          <h2 className="text-heading-xl">Dopamine Diva</h2>
          <p className="text-body-md text-text-secondary">5인 멤버를 소개합니다</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {members.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              selectable={member.id === "A"}
              onDetail={() => setDetailMember(member)}
              onLockedClick={() => setShowLockedModal(true)}
            />
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <Button onClick={() => router.push("/mission")}>
            컴백 미션 시작하기
          </Button>
        </div>
      </div>

      <Modal
        open={!!detailMember}
        onClose={() => setDetailMember(null)}
        title={detailMember?.name}
      >
        {detailMember && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge>{detailMember.role}</Badge>
              <Badge variant="muted">{detailMember.archetype}</Badge>
            </div>
            <p className="text-body-md text-text-secondary">{detailMember.personality}</p>
            <div className="bg-surface-elevated rounded-lg p-3">
              <p className="text-body-sm text-warning/80">{detailMember.trigger}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {detailMember.visualSummary.split(", ").map((kw, i) => (
                <span key={i} className="text-body-sm px-2 py-0.5 bg-surface-soft text-text-muted rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showLockedModal} onClose={() => setShowLockedModal(false)} title="개발 중입니다">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-surface-elevated border border-border flex items-center justify-center">
            <span className="text-2xl">🔧</span>
          </div>
          <p className="text-body-md text-text-secondary">
            해당 멤버는 현재 개발 중입니다.
          </p>
          <p className="text-body-sm text-text-muted">
            <span className="text-primary font-semibold">작곡 멤버(A)</span>부터 먼저 만나보세요!
          </p>
          <Button onClick={() => setShowLockedModal(false)}>
            확인
          </Button>
        </div>
      </Modal>
    </main>
  );
}
