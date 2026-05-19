import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[.3em] text-goldLight">Login</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Entre na sua conta</h1>
          <p className="mt-4 text-muted">Seu login fica salvo em sessão segura pelo Supabase Auth.</p>
        </div>
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-muted">
          Ainda não tem conta? <Link href="/cadastro" className="font-bold text-goldLight">Cadastre-se</Link>
        </p>
      </main>
    </>
  );
}
