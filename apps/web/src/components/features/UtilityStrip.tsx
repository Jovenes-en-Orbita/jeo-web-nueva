import Link from 'next/link';

/**
 * Top utility strip — black bar with Newsletter, Libros, Contacto links.
 * Matches wireframe's .util section.
 */
export function UtilityStrip() {
  return (
    <div className="bg-[var(--color-black)] text-white text-[11px] py-1.5">
      <div className="wrap flex justify-end gap-5">
        <Link href="#" className="opacity-75 hover:opacity-100 transition-opacity">
          Newsletter
        </Link>
        <Link href="#" className="opacity-75 hover:opacity-100 transition-opacity">
          Libros electrónicos
        </Link>
        <Link href="#" className="opacity-75 hover:opacity-100 transition-opacity">
          Contacto
        </Link>
      </div>
    </div>
  );
}
