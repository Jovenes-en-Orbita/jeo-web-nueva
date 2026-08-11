import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** Tamaño en píxeles del emblema circular (default: 44) */
  size?: number;
  /** Mostrar el texto "Jóvenes en Órbita" al lado o debajo (default: true) */
  showText?: boolean;
  /** Enlace opcional al hacer clic (default: '/') */
  href?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Clases CSS para el texto */
  textClassName?: string;
}

/**
 * Componente oficial del Logo de JEO (Jóvenes en Órbita).
 * Renderiza el emblema circular con el apretón de manos, el cohete en órbita y los colores oficiales.
 */
export function Logo({
  size = 44,
  showText = true,
  href = '/',
  className = '',
  textClassName = '',
}: LogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Emblema oficial */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-sm transition-transform duration-200 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.webp"
          alt="JEO — Jóvenes en Órbita"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Texto opcional */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-[var(--font-montserrat)] font-bold text-white tracking-[0.06em] uppercase text-sm leading-tight ${textClassName}`}
          >
            JEO
          </span>
          <span className="font-[var(--font-montserrat)] font-bold text-white/90 text-[11px] tracking-[0.1em] whitespace-nowrap">
            Jóvenes en Órbita
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
