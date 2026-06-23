"use client";

import { useState } from "react";

export default function ChatBubble({
  message,
  role,
  isFirst,
  senderName,
  senderInitial,
  senderAvatarUrl,
}: {
  message: string;
  role: "user" | "assistant";
  isFirst?: boolean;
  senderName?: string;
  senderInitial?: string;
  senderAvatarUrl?: string;
}) {
  const [avatarError, setAvatarError] = useState(false);

  if (role === "user") {
    return (
      <div className="flex justify-end gap-2 items-end">
        <div className="flex flex-col items-end gap-0.5 max-w-[70%]">
          {isFirst && senderName && (
            <span className="text-xs text-text-muted px-1">{senderName}</span>
          )}
          <div className="relative">
            <div className="px-4 py-3 text-sm leading-relaxed bg-primary text-ink rounded-xl rounded-br-sm">
              {message}
            </div>
            <div className="absolute -right-[6px] bottom-[10px] w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-end ${isFirst ? "mt-3" : "mt-0.5"}`}>
      {isFirst ? (
        <div className="w-[34px] h-[34px] rounded-full bg-surface-soft border border-border shrink-0 overflow-hidden flex items-center justify-center text-xs font-bold text-text-muted">
          {!avatarError && senderAvatarUrl ? (
            <img
              src={senderAvatarUrl}
              alt={senderName ?? ""}
              className="w-full h-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            senderInitial ?? "?"
          )}
        </div>
      ) : (
        <div className="w-[34px] shrink-0" />
      )}
      <div className="flex flex-col items-start gap-0.5 max-w-[70%]">
        {isFirst && senderName && (
          <span className="text-xs text-text-muted px-1">{senderName}</span>
        )}
        <div className="relative">
          <div className="px-4 py-3 text-sm leading-relaxed bg-surface-elevated text-text-primary rounded-xl rounded-bl-sm">
            {message}
          </div>
          <div className="absolute -left-[6px] bottom-[10px] w-0 h-0 border-r-[6px] border-r-surface-elevated border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
        </div>
      </div>
    </div>
  );
}
