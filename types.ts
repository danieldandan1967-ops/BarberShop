import Link from "next/link";
import { CalendarCheck, Clock, ShieldCheck, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase-server";
import type { BusinessSettings, Service } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: services }] = await Promise.all([
    supabase.from("business_settings").select("*").limit(1).single(),
    supabase.from("services").select("*").eq("active", true).order("price", { ascending: true }),
  ]);

  const business = settings as BusinessSettings | null;
  const serviceList = (services || []) as Service[];

  return (
    <>
      <Header />

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[.3em] text-goldLight">
              Barbearia premium • agenda online
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-[.92] tracking-[-.06em] md:text-7xl">
              {business?.hero_title || "Corte limpo, barba alinhada e horário confirmado."}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              {business?.hero_description || "Uma barbearia moderna para quem quer praticidade, estilo e organização."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agendar" className="btn-primary">
                Marcar horário agora
              </Link>
              <Link href="#precos" className="btn-secondary">
                Ver preços
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="card p-4"><ShieldCheck className="mb-3 text-goldLight" /><b>Login seguro</b><p className="text-sm text-muted">Sem senha no código.</p></div>
              <div className="card p-4"><CalendarCheck className="mb-3 text-goldLight" /><b>Agenda real</b><p className="text-sm text-muted">Dados no Supabase.</p></div>
              <div className="card p-4"><Clock className="mb-3 text-goldLight" /><b>Admin Hub</b><p className="text-sm text-muted">Controle profissional.</p></div>
            </div>
          </div>

          <div className="card overflow-hidden p-3">
            <div className="relative min-h-[520px] rounded-[1.6rem] bg-[url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center">
              <div className="absolute inset-0 rounded-[1.6rem] bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 grid gap-3">
                <div className="rounded-3xl border border-white/10 bg-black/55 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-goldLight"><Star size={18} /> <b>Experiência premium</b></div>
                  <p className="mt-2 text-sm text-muted">Visual profissional, agenda organizada e atendimento direto pelo WhatsApp.</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/55 p-4"><b className="text-goldLight">4.9★</b><p className="text-xs text-muted">Avaliação</p></div>
                  <div className="rounded-2xl border border-white/10 bg-black/55 p-4"><b className="text-goldLight">24h</b><p className="text-xs text-muted">Pedidos</p></div>
                  <div className="rounded-2xl border border-white/10 bg-black/55 p-4"><b className="text-goldLight">VIP</b><p className="text-xs text-muted">Padrão</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[.3em] text-goldLight">Serviços</p>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">O básico bem feito e o premium no detalhe.</h2>
            </div>
            <p className="max-w-xl text-muted">Serviços claros, preços editáveis e processo de agendamento sem confusão.</p>
          </div>

          <div id="precos" className="grid gap-4 md:grid-cols-3">
            {serviceList.map((service) => (
              <article key={service.id} className="card p-6">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black text-goldLight">
                  {service.duration_minutes} min
                </span>
                <h3 className="mt-5 text-2xl font-black">{service.name}</h3>
                <p className="mt-3 min-h-12 text-muted">{service.description}</p>
                <p className="mt-6 text-4xl font-black text-goldLight">
                  R$ {Number(service.price).toFixed(2).replace(".", ",")}
                </p>
                <Link href="/agendar" className="btn-secondary mt-6 w-full">Agendar serviço</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="card grid gap-6 p-8 text-center md:p-12">
            <p className="text-sm font-black uppercase tracking-[.3em] text-goldLight">Agendamento</p>
            <h2 className="text-4xl font-black tracking-tight md:text-6xl">Pronto para marcar?</h2>
            <p className="mx-auto max-w-2xl text-muted">O cliente entra, escolhe serviço e horário. O admin aprova, recusa ou chama no WhatsApp.</p>
            <div>
              <Link href="/agendar" className="btn-primary">Abrir página de agendamento</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
