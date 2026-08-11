import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import {
  FaInstagram,
  FaXTwitter,
  FaWhatsapp,
  FaFacebookF,
  FaLinkedinIn,
  FaTiktok,
} from 'react-icons/fa6';

const socialLinks = [
  { icon: FaInstagram, name: 'Instagram', href: 'https://instagram.com' },
  { icon: FaXTwitter, name: 'X', href: 'https://x.com' },
  { icon: FaWhatsapp, name: 'WhatsApp', href: 'https://whatsapp.com' },
  { icon: FaFacebookF, name: 'Facebook', href: 'https://facebook.com' },
  { icon: FaLinkedinIn, name: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: FaTiktok, name: 'TikTok', href: 'https://tiktok.com' },
];

/**
 * Footer matching the wireframe's footer.
 * 4-column grid: brand + 3 link columns.
 * Yellow top border, black background, social icons.
 */
export function Footer() {
  return (
    <footer className="bg-[var(--color-black)] text-white border-t-[4px] border-[var(--color-yellow)] relative">
      {/* Top: Brand + columns */}
      <div className="wrap grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-12 md:gap-16 pt-24 pb-20 md:pt-28 md:pb-24 items-start max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {/* Brand */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="mb-6">
              <Logo size={58} showText={true} />
            </div>
            <p className="text-[14.5px] text-[#C8CCD4] leading-relaxed max-w-[330px] mb-6 font-[var(--font-poppins)]">
              Divulgación científica espacial hecha por y para jóvenes, impulsando el
              ecosistema espacial argentino y latinoamericano.
            </p>
          </div>
          <Link
            href="/unite"
            className="inline-flex items-center gap-2 font-[var(--font-montserrat)] font-bold text-sm uppercase tracking-[0.06em] text-[var(--color-yellow)] border-b-2 border-[var(--color-yellow)] pb-1 hover:text-white hover:border-white transition-colors w-fit mt-2"
          >
            Unite a nosotros →
          </Link>
        </div>

        {/* Explorá */}
        <div className="pt-2">
          <h4 className="text-[14px] tracking-[0.14em] text-[#9EA4B0] mb-6 font-bold uppercase font-[var(--font-poppins)]">
            Explorá
          </h4>
          <div className="flex flex-col space-y-3.5 font-[var(--font-poppins)]">
            {[
              { label: 'El Universo', href: '/universo' },
              { label: 'Sistema Solar', href: '/sistema-solar' },
              { label: 'Constelaciones', href: '/constelaciones' },
              { label: 'Noticias Espaciales', href: '/noticias' },
              { label: 'Fragmentos de Memoria', href: '/galeria' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2 text-[15px] text-[#E2E5EB] hover:text-[var(--color-yellow)] transition-all duration-200 ease-out hover:translate-x-2 w-fit"
              >
                <span className="text-[var(--color-yellow)] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-xs">
                  ›
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Organización */}
        <div className="pt-2">
          <h4 className="text-[14px] tracking-[0.14em] text-[#9EA4B0] mb-6 font-bold uppercase font-[var(--font-poppins)]">
            Organización
          </h4>
          <div className="flex flex-col space-y-3.5 font-[var(--font-poppins)]">
            {[
              { label: 'Acerca de JEO', href: '/nosotros' },
              { label: 'Ecosistema Espacial', href: '/ecosistema' },
              { label: 'Recursos & Libros', href: '/libros' },
              { label: 'Newsletter', href: '/newsletter' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2 text-[15px] text-[#E2E5EB] hover:text-[var(--color-yellow)] transition-all duration-200 ease-out hover:translate-x-2 w-fit"
              >
                <span className="text-[var(--color-yellow)] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-xs">
                  ›
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="pt-2">
          <h4 className="text-[14px] tracking-[0.14em] text-[#9EA4B0] mb-6 font-bold uppercase font-[var(--font-poppins)]">
            Contacto
          </h4>
          <a
            href="mailto:jovenesenorbita@gmail.com"
            className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-yellow)] hover:text-white transition-all duration-200 ease-out hover:translate-x-2 select-all mb-6 font-[var(--font-poppins)]"
            title="Enviar correo a jovenesenorbita@gmail.com"
          >
            <span>jovenesenorbita@gmail.com</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
              ↗
            </span>
          </a>

          {/* Social icons */}
          <div className="flex gap-3 flex-wrap">
            {socialLinks.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                  className="w-[40px] h-[40px] bg-white/5 border border-white/15 rounded-full flex items-center justify-center text-[16px] text-[#E2E5EB] transition-all duration-200 hover:border-[var(--color-yellow)] hover:bg-[var(--color-yellow)] hover:text-[var(--color-black)] hover:scale-110"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[#262626] py-6">
        <div className="wrap flex justify-between items-center flex-wrap gap-4 text-xs text-[#8A8F98] font-[var(--font-poppins)]">
          <p>© {new Date().getFullYear()} Jóvenes en Órbita (JEO). Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-[var(--color-yellow)] transition-colors">Políticas & Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
