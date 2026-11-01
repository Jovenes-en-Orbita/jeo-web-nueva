import React from "react";
import Link from "next/link";

export interface ActionButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "outline";
}

/**
 * Botón de acción con estilo editorial espacial (utilizado en "CONOCÉ MÁS", "VOLVER AL INICIO", etc.)
 */
export function ActionButton({
  children,
  href,
  onClick,
  className = "",
  variant = "solid",
}: ActionButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3 rounded-none shadow-md transition-all duration-200 hover:-translate-y-0.5 font-chakra";

  const variantClasses =
    variant === "solid"
      ? "bg-[#1b1c3b] hover:bg-[#252854] "
      : "bg-transparent border border-white/20  hover:bg-white/10 hover:border-white/40";

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <div className="text-white">
        <Link href={href} className={combinedClasses} onClick={onClick}>
          {children}
        </Link>
      </div>
    );
  }

  return (
    <div className="text-white">
      <button type="button" onClick={onClick} className={combinedClasses}>
        {children}
      </button>
    </div>
  );
}
