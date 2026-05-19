import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase-server";
import type { Barber, Service } from "@/lib/types";
import { BookingForm } from "@/components/BookingForm";

async function createAppointment(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const serviceId = String(formData.get("serviceId") || "");
  const barberId = String(formData.get("barberId") || "");
  const date = String(formData.get("date") || "");
  const time = String(formData.get("time") || "");
  const notes = String(formData.get("notes") || "");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", auth.user.id)
    .single();

  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  const { data: barber } = await supabase
    .from("barbers")
    .select("*")
    .eq("id", barberId)
    .single();

  if (!profile || !service || !barber || !date || !time) {
    redirect("/agendar?erro=dados-invalidos");
  }

  const { data: existing } = await supabase
    .from("appointments")
    .select("id")
    .eq("barber_id", barberId)
    .eq("appointment_date", date)
    .eq("appointment_time", time)
    .in("status", ["pending", "confirmed"])
    .maybeSingle();

  if (existing) redirect("/agendar?erro=horario-indisponivel");

  const { error } = await supabase.from("appointments").insert({
    client_id: auth.user.id,
    client_name: profile.full_name || auth.user.email || "Cliente",
    client_phone: profile.phone || "",
    service_id: service.id,
    service_name: service.name,
    barber_id: barber.id,
    barber_name: barber.name,
    appointment_date: date,
    appointment_time: time,
    price: service.price,
    notes,
  });

  if (error) redirect("/agendar?erro=horario-indisponivel");

  redirect("/agendar?sucesso=1");
}

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ sucesso?: string; erro?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const [{ data: services }, { data: barbers }, { data: profile }, { data: myAppointments }] =
    await Promise.all([
      supabase.from("services").select("*").eq("active", true).order("price"),
      supabase.from("barbers").select("*").eq("active", true).order("name"),
      supabase.from("profiles").select("*").eq("id", auth.user.id).single(),
      supabase
        .from("appointments")
        .select("*")
        .eq("client_id", auth.user.id)
        .order("appointment_date", { ascending: false })
        .limit(6),
    ]);

  const serviceList = (services || []) as Service[];
  const barberList = (barbers || []) as Barber[];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[.3em] text-goldLight">Agendamento</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Marque seu horário</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Olá, {profile?.full_name || auth.user.email}. Escolha serviço, barbeiro, data e horário.
          </p>
        </div>

        {params.sucesso && (
          <div className="mb-6 rounded-3xl border border-green-300/20 bg-green-300/10 p-4 text-green-100">
            Agendamento enviado. Aguarde confirmação pelo WhatsApp.
          </div>
        )}

        {params.erro && (
          <div className="mb-6 rounded-3xl border border-red-300/20 bg-red-300/10 p-4 text-red-100">
            Não foi possível agendar. Verifique o horário ou tente outro.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <BookingForm services={serviceList} barbers={barberList} action={createAppointment} />

          <aside className="grid gap-4">
            <div className="card p-6">
              <h2 className="text-2xl font-black">Como funciona</h2>
              <div className="mt-5 grid gap-3 text-muted">
                <p><b className="text-cream">1.</b> Você envia o pedido.</p>
                <p><b className="text-cream">2.</b> O admin confirma no painel.</p>
                <p><b className="text-cream">3.</b> Se não tiver horário, ele chama no WhatsApp.</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-2xl font-black">Seus últimos horários</h2>
              <div className="mt-4 grid gap-3">
                {(myAppointments || []).length === 0 && <p className="text-muted">Nenhum agendamento ainda.</p>}
                {(myAppointments || []).map((item: any) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <b>{item.service_name}</b>
                    <p className="text-sm text-muted">{item.appointment_date} às {item.appointment_time.slice(0, 5)}</p>
                    <span className={`status status-${item.status} mt-2 inline-flex`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
