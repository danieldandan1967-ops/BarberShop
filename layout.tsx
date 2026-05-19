import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { createClient } from "@/lib/supabase-server";
import type { AppointmentStatus } from "@/lib/types";

async function updateStatus(formData: FormData) {
  "use server";
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as AppointmentStatus;

  await supabase
    .from("appointments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  redirect("/admin");
}

async function saveService(formData: FormData) {
  "use server";
  const supabase = await createClient();

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "");
  const price = Number(formData.get("price") || 0);
  const duration = Number(formData.get("duration") || 30);

  if (id) {
    await supabase.from("services").update({ name, price, duration_minutes: duration }).eq("id", id);
  } else {
    await supabase.from("services").insert({ name, price, duration_minutes: duration, active: true });
  }

  redirect("/admin");
}

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") redirect("/agendar");

  const [{ data: appointments }, { data: services }] = await Promise.all([
    supabase.from("appointments").select("*").order("appointment_date", { ascending: true }).order("appointment_time", { ascending: true }),
    supabase.from("services").select("*").order("price", { ascending: true }),
  ]);

  const total = appointments?.length || 0;
  const pending = appointments?.filter((a: any) => a.status === "pending").length || 0;
  const confirmed = appointments?.filter((a: any) => a.status === "confirmed").length || 0;
  const revenue = appointments
    ?.filter((a: any) => a.status === "confirmed" || a.status === "completed")
    .reduce((sum: number, item: any) => sum + Number(item.price || 0), 0) || 0;

  return (
    <>
      <Header admin />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[.3em] text-goldLight">Admin Hub</p>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">Painel administrativo</h1>
            <p className="mt-3 text-muted">Controle agenda, preços e atendimento em um só lugar.</p>
          </div>
          <Link href="/" className="btn-secondary">Voltar ao site</Link>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="card p-5"><p className="text-muted">Total</p><b className="text-4xl text-goldLight">{total}</b></div>
          <div className="card p-5"><p className="text-muted">Pendentes</p><b className="text-4xl text-goldLight">{pending}</b></div>
          <div className="card p-5"><p className="text-muted">Confirmados</p><b className="text-4xl text-goldLight">{confirmed}</b></div>
          <div className="card p-5"><p className="text-muted">Receita estimada</p><b className="text-3xl text-goldLight">R$ {revenue.toFixed(2).replace(".", ",")}</b></div>
        </section>

        <section className="card mb-6 overflow-hidden p-0">
          <div className="border-b border-white/10 p-6">
            <h2 className="text-2xl font-black">Agendas recebidas</h2>
            <p className="text-muted">Confirme, recuse ou fale com o cliente pelo WhatsApp.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="bg-black/30 text-left text-xs uppercase tracking-widest text-goldLight">
                <tr>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Serviço</th>
                  <th className="p-4">Profissional</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Hora</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(appointments || []).map((item: any) => {
                  const phone = String(item.client_phone || "").replace(/\D/g, "");
                  const normalizedPhone = phone.startsWith("55") ? phone : `55${phone}`;
                  const whatsappText = encodeURIComponent(`Olá, ${item.client_name}! Aqui é da BarberShop Elite sobre seu agendamento de ${item.service_name} em ${item.appointment_date} às ${item.appointment_time.slice(0, 5)}.`);
                  return (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="p-4"><b>{item.client_name}</b><p className="text-sm text-muted">{item.client_phone}</p></td>
                      <td className="p-4">{item.service_name}</td>
                      <td className="p-4">{item.barber_name}</td>
                      <td className="p-4">{item.appointment_date}</td>
                      <td className="p-4">{item.appointment_time.slice(0, 5)}</td>
                      <td className="p-4">R$ {Number(item.price).toFixed(2).replace(".", ",")}</td>
                      <td className="p-4"><span className={`status status-${item.status}`}>{item.status}</span></td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <form action={updateStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="confirmed" /><button className="btn-secondary !px-3 !py-2 text-xs">Pode cortar</button></form>
                          <form action={updateStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="rejected" /><button className="btn-secondary !px-3 !py-2 text-xs">Não pode</button></form>
                          <form action={updateStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="completed" /><button className="btn-secondary !px-3 !py-2 text-xs">Concluído</button></form>
                          <a className="btn-primary !px-3 !py-2 text-xs" target="_blank" href={`https://wa.me/${normalizedPhone}?text=${whatsappText}`}>WhatsApp</a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-black">Serviços e preços</h2>
          <p className="mb-5 text-muted">Edite serviços existentes ou adicione novos.</p>

          <div className="grid gap-4">
            {(services || []).map((service: any) => (
              <form key={service.id} action={saveService} className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_140px_140px_auto]">
                <input type="hidden" name="id" value={service.id} />
                <input className="input" name="name" defaultValue={service.name} />
                <input className="input" name="price" type="number" step="0.01" defaultValue={service.price} />
                <input className="input" name="duration" type="number" step="5" defaultValue={service.duration_minutes} />
                <button className="btn-primary">Salvar</button>
              </form>
            ))}

            <form action={saveService} className="grid gap-3 rounded-3xl border border-gold/20 bg-gold/5 p-4 md:grid-cols-[1fr_140px_140px_auto]">
              <input className="input" name="name" placeholder="Novo serviço" required />
              <input className="input" name="price" type="number" step="0.01" placeholder="Preço" required />
              <input className="input" name="duration" type="number" step="5" placeholder="Minutos" required />
              <button className="btn-primary">Adicionar</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
