import React from "react";

interface TooltipCursorProps {
  x: number;
  y: number;
  isNearRight?: boolean;
  label?: string;
}

export function TooltipCursor({
  x,
  y,
  isNearRight = false,
  label = "VER MAS INFORMACIÓN",
}: TooltipCursorProps) {
  return (
    <div
      className="pointer-events-none absolute z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: isNearRight
          ? "translate(calc(-100% + 12px), -100%)"
          : "translate(-8px, -100%)",
      }}
    >
      <div className="relative mb-2">
        {/* Tooltip Bubble */}
        <div className="bg-[#171a33] text-white text-[10px] sm:text-[11px] font-semibold px-3 py-1.5 rounded-md shadow-2xl border border-white/30 whitespace-nowrap tracking-wide font-chakra">
          {label}
        </div>

        {/* Downward triangle/pointer */}
        <div
          className={`absolute -bottom-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#171a33] ${
            isNearRight ? "right-3" : "left-3"
          }`}
        />
      </div>
    </div>
  );
}
