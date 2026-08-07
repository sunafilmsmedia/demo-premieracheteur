"use client";

import { PropertyType } from "@/lib/types";

const GOLD = "#c9a227";
const GOLD_SOFT = "#e8c95f";
const LINE = "#3a3a40";

// Illustrations SVG inline (aucun asset externe), accents dorés.
export function PropertyIllustration({ type }: { type?: PropertyType }) {
  const t = type ?? "open";
  return (
    <div className="mx-auto flex h-32 w-full items-end justify-center">
      <svg viewBox="0 0 200 130" className="h-full w-auto" role="img" aria-hidden>
        {t === "condo" && (
          <g fill="none" stroke={LINE} strokeWidth="2">
            <rect x="70" y="20" width="60" height="100" fill="#141416" />
            {[30, 50, 70, 90].map((y) =>
              [80, 100].map((x) => (
                <rect
                  key={`${x}-${y}`}
                  x={x}
                  y={y}
                  width="14"
                  height="10"
                  fill={GOLD}
                  stroke="none"
                  opacity="0.85"
                />
              ))
            )}
          </g>
        )}

        {t === "house" && (
          <g fill="none" stroke={LINE} strokeWidth="2">
            <polygon points="50,60 100,25 150,60" fill={GOLD} stroke="none" />
            <rect x="60" y="60" width="80" height="60" fill="#141416" />
            <rect x="90" y="85" width="20" height="35" fill={GOLD} stroke="none" />
            <rect x="68" y="70" width="16" height="16" fill={GOLD_SOFT} stroke="none" />
            <rect x="116" y="70" width="16" height="16" fill={GOLD_SOFT} stroke="none" />
          </g>
        )}

        {t === "townhouse" && (
          <g fill="none" stroke={LINE} strokeWidth="2">
            {[40, 90, 140].map((x, i) => (
              <g key={x}>
                <polygon
                  points={`${x},55 ${x + 25},35 ${x + 50},55`}
                  fill={i === 1 ? GOLD : GOLD_SOFT}
                  stroke="none"
                  opacity={i === 1 ? 1 : 0.7}
                />
                <rect x={x} y="55" width="50" height="65" fill="#141416" />
                <rect x={x + 18} y="90" width="14" height="30" fill={GOLD} stroke="none" />
              </g>
            ))}
          </g>
        )}

        {t === "plex" && (
          <g fill="none" stroke={LINE} strokeWidth="2">
            <rect x="60" y="30" width="80" height="90" fill="#141416" />
            {[42, 68, 94].map((y) => (
              <g key={y}>
                <rect x={70} y={y} width="18" height="14" fill={GOLD} stroke="none" opacity="0.85" />
                <rect x={112} y={y} width="18" height="14" fill={GOLD} stroke="none" opacity="0.85" />
              </g>
            ))}
            {/* escalier extérieur */}
            <path d="M140 120 L165 120 L165 70" stroke={GOLD_SOFT} strokeWidth="2.5" />
            {[80, 92, 104].map((y) => (
              <line key={y} x1="150" y1={y} x2="165" y2={y} stroke={GOLD_SOFT} strokeWidth="2" />
            ))}
          </g>
        )}

        {t === "open" && (
          <g fill="none" stroke={LINE} strokeWidth="2">
            <polygon points="55,58 100,28 145,58" fill={GOLD} stroke="none" opacity="0.9" />
            <rect x="65" y="58" width="70" height="62" fill="#141416" />
            <circle cx="100" cy="88" r="14" fill="none" stroke={GOLD_SOFT} strokeWidth="2.5" />
            <text x="100" y="94" textAnchor="middle" fill={GOLD_SOFT} fontSize="16">
              ?
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
