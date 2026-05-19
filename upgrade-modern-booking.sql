import Link from "next/link";
import { Scissors } from "lucide-react";

export function Header({ admin = false }: { admin?: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/75 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-goldLight to-gold text-black shadow-glow">
            <Scissors size={24} />
          </span>
          <span>
            BarberShop Elite
            <small className="block text-[11px] uppercase tracking-[.22em] text-muted">
              {admin ? "Admin Hub" : "Agenda Premium"}
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-muted md:flex">
          <Link href="/#servicos" className="hover:text-goldLight">Serviços</Link>
          <Link href="/#precos" className="hover:text-goldLight">Preços</Link>
          <Link href="/agendar" className="hover:text-goldLight">Agendar</Link>
          <Link href="/login" className="hover:text-goldLight">Login</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/agendar" className="btn-primary hidden sm:inline-flex">
            Marcar horário
          </Link>
          <Link href={admin ? "/" : "/admin"} className="btn-secondary">
            {admin ? "Ver site" : "Admin"}
          </Link>
        </div>
      </div>
    </header>
  );
}
