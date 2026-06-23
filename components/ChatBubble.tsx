"use client";

export default function ChatBubble({
  message,
  role,
}: {
  message: string;
  role: "user" | "assistant";
}) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-3 text-sm leading-relaxed ${
          role === "user"
            ? "bg-primary text-ink rounded-xl rounded-br-md"
            : "bg-surface-elevated text-text-primary rounded-xl rounded-bl-md"
        }`}
      >
        {message}
      </div>
    </div>
  );
}
