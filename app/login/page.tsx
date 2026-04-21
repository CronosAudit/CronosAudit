"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, Lock, Mail } from "lucide-react"
import * as React from "react"

import { Navbar } from "@/components/ui/navbar"
import { BackgroundPaths } from "@/components/ui/background-paths"
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email.trim() || !password.trim()) {
      setError("Preencha seu e-mail e senha.")
      return
    }

    try {
      setIsLoading(true)

      await signInWithEmail(email.trim(), password)

      if (rememberMe && typeof window !== "undefined") {
        localStorage.setItem("chronos_remember_email", email.trim())
      } else if (typeof window !== "undefined") {
        localStorage.removeItem("chronos_remember_email")
      }

      setSuccess("Login realizado com sucesso.")
      router.push("/dashboard")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível entrar."

      setError(traduzirErroAuth(message))
    } finally {
      setIsLoading(false)
    }
  }


  React.useEffect(() => {
    if (typeof window === "undefined") return

    const savedEmail = localStorage.getItem("chronos_remember_email")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-[#0b0b0c] text-white">
        <section className="relative min-h-screen">

          <div className="absolute inset-0 -z-10 bg-[#0b0b0c]/88" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute left-[-8rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.16)_0%,rgba(212,175,55,0.05)_35%,transparent_72%)] blur-3xl md:h-[34rem] md:w-[34rem]" />
            <div className="absolute right-[-10rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(120,119,108,0.12)_0%,rgba(120,119,108,0.05)_40%,transparent_75%)] blur-3xl md:h-[30rem] md:w-[30rem]" />
            <div className="absolute bottom-[-12rem] left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(166,124,82,0.12)_0%,rgba(166,124,82,0.03)_45%,transparent_75%)] blur-3xl md:h-[28rem] md:w-[28rem]" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_100%,transparent_0%,#0b0b0c_62%)]" />
          </div>

          <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pt-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-sm text-[#f4e7b2] backdrop-blur-md">
                <ShieldCheck className="size-4" />
                Acesso seguro ao Chronos Audit
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
                Entre na sua conta com{" "}
                <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                  segurança e clareza
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg md:text-xl md:leading-8">
                Acesse seus fluxos, evidências, revisões e recursos da
                plataforma em uma experiência alinhada à governança e à
                rastreabilidade do trabalho.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
                  icon={<Mail className="size-4 text-[#d4af37]" />}
                  title="Agilidade"
                  text="Entrada rápida"
                />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-white/10 bg-[#111214]/90 p-2 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm">
                <div className="rounded-[24px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02),rgba(184,135,70,0.06))] p-6 sm:p-8">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-[#f4e7b2]">Login</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                      Bem-vindo de volta
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Entre para continuar sua experiência no Chronos Audit.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Field label="E-mail">
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="email"
                          placeholder="voce@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                        />
                      </div>
                    </Field>

                    <Field label="Senha">
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </Field>

                    {(error || success) && (
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          error
                            ? "border-red-500/20 bg-red-500/10 text-red-200"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                        }`}
                      >
                        {error || success}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-1">
                      <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="size-4 rounded border-white/10 bg-black/30 text-[#d4af37] focus:ring-[#d4af37]/20"
                        />
                        Lembrar de mim
                      </label>

                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#f4e7b2] transition hover:opacity-80"
                      >
                        Esqueci minha senha
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="h-12 w-full rounded-2xl bg-[#d4af37] text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                        <ShieldCheck className="size-4 text-[#d4af37]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Ambiente protegido
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          Sua experiência foi desenhada para combinar clareza
                          operacional, segurança e governança.
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
                      Inscreva-se
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

  return message
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">{label}</label>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
        {icon}
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  )
}