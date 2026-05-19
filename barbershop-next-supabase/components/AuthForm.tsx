"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("fullName") || "");
    const phone = String(formData.get("phone") || "");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, phone } },
          });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    router.push(mode === "login" ? "/agendar" : "/login");
    router.refresh();
  }

  return (
    <form action={submit} className="card mx-auto grid max-w-xl gap-4 p-6">
      {mode === "signup" && (
        <>
          <div>
            <label className="label">Nome completo</label>
            <input className="input mt-2" name="fullName" required placeholder="Seu nome" />
          </div>
          <div>
            <label className="label">WhatsApp</label>
            <input className="input mt-2" name="phone" required placeholder="27999998888" />
          </div>
        </>
      )}

      <div>
        <label className="label">E-mail</label>
        <input className="input mt-2" type="email" name="email" required placeholder="voce@email.com" />
      </div>

      <div>
        <label className="label">Senha</label>
        <input className="input mt-2" type="password" name="password" required minLength={6} placeholder="Mínimo 6 caracteres" />
      </div>

      {message && <p className="rounded-2xl border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-100">{message}</p>}

      <button disabled={loading} className="btn-primary">
        {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
      </button>
    </form>
  );
}
