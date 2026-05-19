import Link from "next/link";
import { Header } from "@/components/Header";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[.3em] text-goldLight">Cadastro</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">Crie sua conta</h1>
          <p className="mt-4 text-muted">Depois do cadastro, seus dados ficam conectados aos seus agendamentos.</p>
        </div>
        <AuthForm mode="signup" />
        <p className="mt-6 text-center text-muted">
          Já tem conta? <Link href="/login" className="font-bold text-goldLight">Entrar</Link>
        </p>
      </main>
    </>
  );
}
