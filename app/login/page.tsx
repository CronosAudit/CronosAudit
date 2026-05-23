"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { signInWithEmail, signInWithGoogle } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const savedEmail = localStorage.getItem("chronos_remember_email")

    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")

    const cleanEmail = email.trim()

    if (!cleanEmail || !password.trim()) {
      setError("Preencha seu e-mail e senha.")
      return
    }

    try {
      setIsLoading(true)

      await signInWithEmail(cleanEmail, password)

      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("chronos_remember_email", cleanEmail)
        } else {
          localStorage.removeItem("chronos_remember_email")
        }
      }

      setSuccess("Login realizado com sucesso. Redirecionando...")
      router.push("/dashboard")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível entrar."
      setError(traduzirErroAuth(message))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError("")
    setSuccess("")

    try {
      setIsGoogleLoading(true)
      await signInWithGoogle()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível entrar com Google."
      setError(traduzirErroAuth(message))
      setIsGoogleLoading(false)
    }
  }

  const disabled = isLoading || isGoogleLoading

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-[#0b0b0c] text-white">
        <section className="relative min-h-screen">
          <div className="absolute inset-0 -z-10 bg-[#0b0b0c]" />

          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-[-9rem] top-[-9rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.06)_38%,transparent_72%)] blur-3xl sm:h-[34rem] sm:w-[34rem]" />
            <div className="absolute right-[-12rem] top-[15rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(184,135,70,0.16)_0%,rgba(184,135,70,0.05)_42%,transparent_74%)] blur-3xl sm:h-[32rem] sm:w-[32rem]" />
            <div className="absolute bottom-[-14rem] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,231,178,0.08)_0%,rgba(244,231,178,0.03)_45%,transparent_75%)] blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,12,0.2),rgba(11,11,12,0.92))]" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_100%,transparent_0%,#0b0b0c_70%)]" />
          </div>

          <div className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 pb-10 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-14 lg:pt-32">
            <div className="order-2 mx-auto w-full max-w-2xl text-center lg:order-1 lg:mx-0 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-xs font-medium text-[#f4e7b2] shadow-lg shadow-black/20 backdrop-blur-md sm:text-sm">
                <ShieldCheck className="size-4" />
                Acesso seguro ao Chronos Audit
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:mt-6 sm:text-5xl md:text-6xl">
                Entre na sua conta com{" "}
                <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                  segurança e clareza
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-300 sm:mt-5 sm:text-lg md:text-xl md:leading-8 lg:mx-0">
                Acesse fluxos, evidências, revisões e recursos da plataforma em
                uma experiência alinhada à governança, rastreabilidade e auditoria.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:mt-8">
                <InfoPill
                  icon={<Lock className="size-4 text-[#d4af37]" />}
                  title="Proteção"
                  text="Acesso controlado"
                />
                <InfoPill
                  icon={<ShieldCheck className="size-4 text-[#d4af37]" />}
                  title="Confiança"
                  text="Fluxos auditáveis"
                />
                <InfoPill
                  icon={<Sparkles className="size-4 text-[#d4af37]" />}
                  title="Agilidade"
                  text="Entrada rápida"
                />
              </div>
            </div>

            <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-lg">
              <div className="rounded-[26px] border border-white/10 bg-[#111214]/90 p-2 shadow-2xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl sm:rounded-[32px]">
                <div className="rounded-[22px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.09),rgba(255,255,255,0.025),rgba(184,135,70,0.07))] p-5 sm:rounded-[28px] sm:p-8">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-[#f4e7b2]">Login</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      Bem-vindo de volta
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Entre para continuar sua experiência no Chronos Audit.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Field label="E-mail" htmlFor="email">
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          id="email"
                          type="email"
                          placeholder="voce@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          inputMode="email"
                          disabled={disabled}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/15"
                        />
                      </div>
                    </Field>

                    <Field label="Senha" htmlFor="password">
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          disabled={disabled}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-60 focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/15"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          disabled={disabled}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </Field>

                    {(error || success) && (
                      <div
                        role="status"
                        className={`flex gap-3 rounded-2xl border px-4 py-3 text-sm ${
                          error
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        }`}
                      >
                        {error ? (
                          <AlertCircle className="mt-0.5 size-4 shrink-0" />
                        ) : (
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        )}
                        <span>{error || success}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          disabled={disabled}
                          className="size-4 rounded border-white/10 bg-black/30 accent-[#d4af37] disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        Lembrar meu e-mail
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-[#f4e7b2] transition hover:opacity-80"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={disabled}
                      className="h-12 w-full rounded-2xl bg-[#d4af37] text-sm font-semibold text-black shadow-lg shadow-[#d4af37]/10 hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Entrar
                          <ArrowRight className="size-4" />
                        </span>
                      )}
                    </Button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      ou
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    disabled={disabled}
                    className="h-12 w-full rounded-2xl border-white/10 bg-white/[0.04] text-sm font-semibold text-white hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isGoogleLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Conectando...
                      </span>
                    ) : (
                      "Entrar com Google"
                    )}
                  </Button>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                        <ShieldCheck className="size-4 text-[#d4af37]" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-white">
                          Ambiente protegido
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          Sua experiência combina clareza operacional, segurança
                          e governança em todos os dispositivos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-zinc-400">
                    Ainda não tem conta?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-[#f4e7b2] transition hover:opacity-80"
                    >
                      Criar conta
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function traduzirErroAuth(message: string) {
  const normalized = message.toLowerCase()

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_credentials")
  ) {
    return "E-mail ou senha inválidos."
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar."
  }

  if (normalized.includes("too many requests")) {
    return "Muitas tentativas. Tente novamente em alguns minutos."
  }

  if (normalized.includes("network")) {
    return "Erro de conexão. Verifique sua internet e tente novamente."
  }

  return message
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-200">
        {label}
      </label>
      {children}
    </div>
  )
}

function InfoPill({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-sm transition hover:border-[#d4af37]/20 hover:bg-white/[0.06]">
      <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
        {icon}
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  )
}