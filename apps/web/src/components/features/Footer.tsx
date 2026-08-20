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
 * Footer component perfectly centered vertically inside its horizontal slide layout.
 */
export function Footer() {
  return (
    <footer className="bg-[#050811] text-white border-t-[3px] border-[var(--color-yellow)] relative h-full flex flex-col justify-between">
      {/* Centered Main Content Area */}
      <div className="flex-1 flex items-center justify-center py-6">
        <div className="wrap grid grid-cols-[1.4fr_1fr_1fr_1.1fr] gap-10 items-start max-[900px]:grid-cols-2 max-[600px]:grid-cols-1 w-full">
          {/* Brand */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <Logo size={52} showText={true} />
              </div>
              <p className="text-[13.5px] text-slate-300 leading-relaxed max-w-[320px] mb-4 font-[var(--font-poppins)]">
                Divulgación científica espacial hecha por y para jóvenes, impulsando el
                ecosistema espacial argentino y latinoamericano.
              </p>
            </div>
            <Link
              href="/unite"
              className="inline-flex items-center gap-2 font-[var(--font-montserrat)] font-bold text-xs uppercase tracking-[0.08em] text-[var(--color-yellow)] border-b-2 border-[var(--color-yellow)] pb-1 hover:text-white hover:border-white transition-all hover:gap-3 w-fit"
            >
              Unite a nosotros →
            </Link>
          </div>

          {/* Explorá */}
          <div>
            <h4 className="text-[13px] tracking-[0.14em] text-slate-400 mb-4 font-bold uppercase font-[var(--font-poppins)]">
              Explorá
            </h4>
            <div className="flex flex-col space-y-2.5 font-[var(--font-poppins)]">
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
                  className="group inline-flex items-center gap-1.5 text-[14px] text-slate-300 hover:text-[var(--color-yellow)] transition-all duration-200 ease-out hover:translate-x-1.5 w-fit"
                >
                  <span className="text-[var(--color-yellow)] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-xs">
                    ›
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Organización */}
          <div>
            <h4 className="text-[13px] tracking-[0.14em] text-slate-400 mb-4 font-bold uppercase font-[var(--font-poppins)]">
              Organización
            </h4>
            <div className="flex flex-col space-y-2.5 font-[var(--font-poppins)]">
              {[
                { label: 'Acerca de JEO', href: '/nosotros' },
                { label: 'Ecosistema Espacial', href: '/ecosistema' },
                { label: 'Recursos & Libros', href: '/libros' },
                { label: 'Newsletter', href: '/newsletter' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-1.5 text-[14px] text-slate-300 hover:text-[var(--color-yellow)] transition-all duration-200 ease-out hover:translate-x-1.5 w-fit"
                >
                  <span className="text-[var(--color-yellow)] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-xs">
                    ›
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contacto & Social */}
          <div>
            <h4 className="text-[13px] tracking-[0.14em] text-slate-400 mb-4 font-bold uppercase font-[var(--font-poppins)]">
              Contacto
            </h4>
            <a
              href="mailto:jovenesenorbita@gmail.com"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-yellow)] hover:text-white transition-all duration-200 ease-out hover:translate-x-1 select-all mb-4 font-[var(--font-poppins)] block"
              title="Enviar correo a jovenesenorbita@gmail.com"
            >
              <span>jovenesenorbita@gmail.com</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
                ↗
              </span>
            </a>

            {/* Social icons */}
            <div className="flex gap-2.5 flex-wrap">
              {socialLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="w-[36px] h-[36px] bg-white/5 border border-white/15 rounded-full flex items-center justify-center text-[14px] text-slate-300 transition-all duration-200 hover:border-[var(--color-yellow)] hover:bg-[var(--color-yellow)] hover:text-[#0b111e] hover:scale-110"
                  >
                    <IconComponent />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-white/10 py-4 bg-[#03050c] flex-shrink-0">
        <div className="wrap flex justify-between items-center flex-wrap gap-3 text-xs text-slate-400 font-[var(--font-poppins)]">
          <p>© {new Date().getFullYear()} Jóvenes en Órbita (JEO). Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="hover:text-[var(--color-yellow)] transition-colors">Políticas & Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
