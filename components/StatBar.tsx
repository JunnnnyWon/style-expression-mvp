"use client";

import { useEffect, useState } from "react";

type StatColor = "popularity" | "affection" | "jealousy" | "mental" | "scandal";

const colorMap: Record<StatColor, { bar: string; text: string }> = {
  popularity: { bar: "bg-success", text: "text-success" },
  affection: { bar: "bg-primary", text: "text-primary" },
  jealousy: { bar: "bg-danger", text: "text-danger" },
  mental: { bar: "bg-tertiary", text: "text-tertiary" },
  scandal: { bar: "bg-warning", text: "text-warning" },
};

export default function StatBar({
  label,
  value,
  color = "popularity",
  showValue = true,
  height = "h-2",
}: {
  label: string;
  value: number;
  color?: StatColor;
  showValue?: boolean;
  height?: string;
}) {
  const [animValue, setAnimValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const colors = colorMap[color];

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-text-muted tracking-[-0.005em]">{label}</span>
        {showValue && (
          <span className="text-text-secondary font-mono">{animValue}</span>
        )}
      </div>
      <div className={`${height} bg-surface-elevated rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${animValue}%` }}
        />
      </div>
    </div>
  );
}
