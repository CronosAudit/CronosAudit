"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
} from "lucide-react"
import * as React from "react"

import { Navbar } from "@/components/ui/navbar"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Button } from "@/components/ui/button"
import { signInWithGoogle, signUpWithEmail } from "@/lib/auth"

export default function SignupPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [acceptedTerms, setAcceptedTerms] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  const passwordChecks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordValid =
    passwordChecks.minLength &&
    passwordChecks.hasUppercase &&
    passwordChecks.hasNumber

  const shouldShowPasswordRequirements = password.length > 0 && !isPasswordValid

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Preencha todos os campos.")
      return
    }

    if (!isPasswordValid) {
      setError("Sua senha ainda não atende aos requisitos.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (!acceptedTerms) {
      setError("Você precisa aceitar os termos de uso e a política de privacidade.")
      return
    }

    try {
      setIsLoading(true)

      const data = await signUpWithEmail(name.trim(), email.trim(), password)

      if (data.session) {
        setSuccess("Conta criada com sucesso.")
        router.push("/chat")
        return
      }

      setSuccess(
        "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro."
      )

      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setAcceptedTerms(false)

      setTimeout(() => {
        router.push("/login")
      }, 1200)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível criar a conta."

      setError(traduzirErroAuth(message))
    } finally {
      setIsLoading(false)
    }
  }


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

          <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 pb-12 pt-28 sm:px-6 md:pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:pt-36">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-sm text-[#f4e7b2] backdrop-blur-md">
                <ArrowRight className="size-4" />
                Comece com uma base segura e escalável
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
                Crie sua conta e entre no{" "}
                <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                  ecossistema Chronos Audit
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg md:text-xl md:leading-8">
                Cadastre-se para acessar uma experiência moderna de auditoria
                com apoio à documentação, governança, rastreabilidade e revisão.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <InfoPill title="Estrutura" text="Fluxos mais claros" />
                <InfoPill title="Governança" text="Uso responsável da IA" />
                <InfoPill title="Escala" text="Pronto para crescimento" />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-white/10 bg-[#111214]/90 p-2 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm">
                <div className="rounded-[24px] border border-[#d4af37]/15 bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,255,255,0.02),rgba(184,135,70,0.06))] p-6 sm:p-8">
                  <div className="mb-6">
                    <p className="text-sm font-medium text-[#f4e7b2]">
                      Inscreva-se
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                      Criar nova conta
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Preencha os dados abaixo para começar.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <Field label="Nome completo">
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                        />
                      </div>
                    </Field>

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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Senha">
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Crie uma senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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

                      <Field label="Confirmar senha">
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
                            aria-label={
                              showConfirmPassword
                                ? "Ocultar confirmação de senha"
                                : "Mostrar confirmação de senha"
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </Field>
                    </div>

                    {shouldShowPasswordRequirements && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-sm font-medium text-white">
                          Requisitos da senha
                        </p>

                        <div className="mt-3 grid gap-2 text-sm text-zinc-400">
                          {!passwordChecks.minLength && (
                            <p>Pelo menos 8 caracteres</p>
                          )}
                          {!passwordChecks.hasUppercase && (
                            <p>Uma letra maiúscula</p>
                          )}
                          {!passwordChecks.hasNumber && <p>Um número</p>}
                        </div>
                      </div>
                    )}

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

                    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-white/10 bg-black/30 text-[#d4af37] focus:ring-[#d4af37]/20"
                      />
                      <span>
                        Concordo com os termos de uso e com a política de
                        privacidade da plataforma.
                      </span>
                    </label>

                    <Button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="h-12 w-full rounded-2xl bg-[#d4af37] text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                        <ShieldCheck className="size-4 text-[#d4af37]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Cadastro com foco em segurança
                        </p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          Sua conta será a base para fluxos mais organizados,
                          consistentes e prontos para evolução.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-center text-sm text-zinc-400">
                    Já possui conta?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#f4e7b2] transition hover:opacity-80"
                    >
                      Entrar
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

  if (normalized.includes("user already registered")) {
    return "Já existe uma conta cadastrada com este e-mail."
  }

  if (normalized.includes("password should be at least")) {
    return "A senha precisa ter pelo menos 6 caracteres."
  }

  if (normalized.includes("invalid email")) {
    return "Informe um e-mail válido."
  }

  if (normalized.includes("signup is disabled")) {
    return "O cadastro está desabilitado no momento."
  }

  if (normalized.includes("unable to validate email address")) {
    return "Não foi possível validar este e-mail."
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
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-zinc-400">{text}</p>
    </div>
  )
}