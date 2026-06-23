"use client";

import { Ending } from "@/data/members";
import { useState } from "react";

const endingThemes: Record<string, { gradient: string; label: string }> = {
  "dome-light": { gradient: "from-emerald-900/60 via-teal-900/40 to-black/90", label: "ENDING 01" },
  "local-stage": { gradient: "from-violet-900/60 via-zinc-800/40 to-black/90", label: "ENDING 02" },
  "after-contract": { gradient: "from-zinc-800/60 via-zinc-900/40 to-black/90", label: "ENDING 03" },
  "business-exit": { gradient: "from-amber-900/60 via-orange-900/40 to-black/90", label: "ENDING 04" },
  "night-fall": { gradient: "from-rose-900/60 via-purple-900/40 to-black/90", label: "ENDING 05" },
};

export default function EndingCard({ ending }: { ending: Ending }) {
  const [imgError, setImgError] = useState(false);
  const theme = endingThemes[ending.id] ?? endingThemes["local-stage"];

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="aspect-video bg-surface-elevated overflow-hidden relative">
        {!imgError && ending.imageUrl ? (
          <img
            src={ending.imageUrl}
            alt={ending.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
        )}
        {imgError && <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-block px-[10px] py-[6px] rounded-full bg-surface-soft text-primary-hover text-label-caps">
            {theme.label}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <h3 className="text-display-lg text-white drop-shadow-lg">
            {ending.title}
          </h3>
          <p className="text-sm text-text-secondary">{ending.tone}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-text-secondary leading-relaxed">{ending.description}</p>
      </div>
    </div>
  );
}
