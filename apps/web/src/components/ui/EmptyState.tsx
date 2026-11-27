import React from "react";

interface EmptyStateProps {
  message: string;
  title?: string;
  icon?: React.ReactNode;
  surface?: "dark" | "light";
  action?: React.ReactNode;
}

/**
 * Estado vacío reutilizable del Design System de JEO.
 */
export function EmptyState({
  message,
  title,
  icon,
  surface = "dark",
  action,
}: EmptyStateProps) {
  const isDark = surface === "dark";

  return (
    <div
      className={`py-14 px-6 text-center border space-y-3 ${
        isDark
          ? "border-white/10 bg-[#080d1a] text-slate-400"
          : "border-neutral-200 bg-neutral-50 text-neutral-600"
      }`}
    >
      {icon && <div className="flex justify-center">{icon}</div>}
      {title && (
        <h3
          className={`text-base font-bold font-montserrat ${
            isDark ? "text-white" : "text-neutral-900"
          }`}
        >
          {title}
        </h3>
      )}
      <p className="text-sm font-inter max-w-md mx-auto">{message}</p>
      {action && <div className="pt-2 flex justify-center">{action}</div>}
    </div>
  );
}
