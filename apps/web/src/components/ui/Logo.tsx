import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** Tamaño en píxeles del emblema circular (default: 44) */
  size?: number;
  /** Mostrar texto o prop legado (default: true) */
  showText?: boolean;
  /** Enlace opcional al hacer clic (default: '/') */
  href?: string;
  /** Clases CSS adicionales para el contenedor */
  className?: string; wefqfq
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
}: LogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-3 ${className} transition-transform duration-200 hover:scale-105`}>
      {/* Emblema oficial */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-full overflow-hidden shadow-sm"
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
