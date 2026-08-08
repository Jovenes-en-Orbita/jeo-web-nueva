import Link from 'next/link';

/**
 * Footer matching the wireframe's footer.
 * 4-column grid: brand + 3 link columns.
 * Yellow top border, black background, social icons.
 */
export function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white border-t-4 border-[var(--color-yellow)]">
      {/* Top: Brand + columns */}
      <div className="wrap grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 pt-[52px] pb-10 max-[900px]:grid-cols-2">
        {/* Brand */}
        <div>
          <div className="w-11 h-11 rounded-full border-[2.5px] border-white flex items-center justify-center text-white font-[var(--font-barlow)] font-bold text-base mb-3.5">
            JEO
          </div>
          <h3 className="text-[20px] text-white font-[var(--font-barlow)] font-bold uppercase tracking-[0.02em] mb-2.5">
            Jóvenes en Órbita
          </h3>
          <p className="text-[12.5px] text-[#B9BEC6] leading-relaxed max-w-[260px] mb-[18px]">
            Divulgación científica espacial hecha por y para jóvenes, con foco
            en el ecosistema espacial argentino.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 font-[var(--font-barlow)] font-semibold text-[13px] uppercase tracking-[0.05em] text-[var(--color-yellow)] border-b-2 border-[var(--color-yellow)] pb-0.5 hover:text-white hover:border-white transition-colors"
          >
            Unite a nosotros →
          </Link>
        </div>

        {/* Explorá */}
        <div>
          <h4 className="text-[12px] tracking-[0.1em] text-[#8A8F98] mb-4 font-semibold uppercase font-[var(--font-inter)]">
            Explorá
          </h4>
          <Link href="#u" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            El Universo
          </Link>
          <Link href="#ss" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Sistema Solar
          </Link>
          <Link href="#const" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Constelaciones
          </Link>
          <Link href="#news" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Noticias Espaciales
          </Link>
          <Link href="#frag" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Fragmentos de Memoria
          </Link>
        </div>

        {/* Organización */}
        <div>
          <h4 className="text-[12px] tracking-[0.1em] text-[#8A8F98] mb-4 font-semibold uppercase font-[var(--font-inter)]">
            Organización
          </h4>
          <Link href="#" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Acerca de Jóvenes en Órbita
          </Link>
          <Link href="#" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Ecosistema Espacial Argentino
          </Link>
          <Link href="#" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Recursos de aprendizaje
          </Link>
          <Link href="#" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Newsletter
          </Link>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-[12px] tracking-[0.1em] text-[#8A8F98] mb-4 font-semibold uppercase font-[var(--font-inter)]">
            Contacto
          </h4>
          <Link href="#" className="block text-[13px] text-[#DEE1E6] mb-[11px] hover:underline">
            Contacta con JEO
          </Link>
          {/* Social icons */}
          <div className="flex gap-2.5 mt-3">
            {['Ig', 'X', 'Wa', 'Fb', 'In', 'Tk'].map((icon) => (
              <span
                key={icon}
                className="w-[30px] h-[30px] border border-[#3A3A3A] rounded-full flex items-center justify-center text-[10px] text-[#DEE1E6] cursor-pointer transition-all duration-200 hover:border-[var(--color-yellow)] hover:text-[var(--color-yellow)] hover:scale-110"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="wrap border-t border-[#2A2A2A] py-5 flex justify-between items-center flex-wrap gap-3.5">
        <div className="text-[11px] text-[#8A8F98] flex gap-[18px] flex-wrap">
          <span>Última actualización: agosto 2026</span>
          <span>Contacta con JEO</span>
        </div>
      </div>
    </footer>
  );
}
