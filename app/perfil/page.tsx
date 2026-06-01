"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"

import { Navbar } from "@/components/ui/navbar"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function PerfilPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSavingProfile, setIsSavingProfile] = React.useState(false)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [createdAt, setCreatedAt] = React.useState("")

  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")

  React.useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true)
        setError("")

        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        setEmail(user.email || "")
        setName(
          String(
            user.user_metadata?.name ||
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              ""
          )
        )
        setCreatedAt(user.created_at || "")
      } catch {
        setError("Não foi possível carregar seu perfil.")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router])

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (isSavingProfile) return

    setError("")
    setSuccess("")

    const cleanName = name.trim()

    if (!cleanName) {
      setError("Informe seu nome.")
      return
    }

    try {
      setIsSavingProfile(true)

      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: cleanName,
          full_name: cleanName,
        },
      })

      if (error) throw error

      setName(
        String(
          data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            cleanName
        )
      )

      setSuccess("Perfil atualizado com sucesso.")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível atualizar o perfil."

      setError(traduzirErroPerfil(message))
    } finally {
      setIsSavingProfile(false)
    }
  }

  const joinedAt = createdAt
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(createdAt))
    : "Não informado"

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-x-hidden bg-[#0b0b0c] text-white">
        <section className="relative min-h-screen px-4 pb-12 pt-28 sm:px-6 lg:pt-32">
          <div className="absolute inset-0 -z-10 bg-[#0b0b0c]" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute left-[-9rem] top-[-9rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.06)_38%,transparent_72%)] blur-3xl" />
            <div className="absolute right-[-12rem] top-[18rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(184,135,70,0.14)_0%,rgba(184,135,70,0.04)_42%,transparent_74%)] blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_100%,transparent_0%,#0b0b0c_72%)]" />
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </button>

            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-white/5 px-4 py-2 text-sm text-[#f4e7b2] backdrop-blur-md">
                <ShieldCheck className="size-4" />
                Área do usuário
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
                Meu{" "}
                <span className="bg-gradient-to-r from-[#f8e7a1] via-[#d4af37] to-[#b88746] bg-clip-text text-transparent">
                  perfil
                </span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
                Gerencie seus dados básicos da conta.
              </p>
            </div>

            {isLoading ? (
              <div className="flex min-h-[380px] items-center justify-center rounded-[28px] border border-white/10 bg-[#111214]/90">
                <div className="flex items-center gap-3 text-zinc-300">
                  <Loader2 className="size-5 animate-spin text-[#d4af37]" />
                  Carregando perfil...
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                <aside className="rounded-[28px] border border-white/10 bg-[#111214]/90 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-3xl border border-[#d4af37]/20 bg-[#d4af37]/10">
                      <User className="size-7 text-[#d4af37]" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold text-white">
                        {name || "Usuário"}
                      </h2>
                      <p className="truncate text-sm text-zinc-400">{email}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <ProfileInfo label="E-mail" value={email || "Não informado"} />
                    <ProfileInfo label="Conta criada em" value={joinedAt} />
                    <ProfileInfo label="Status" value="Ativa" />
                  </div>
                </aside>

                <div className="space-y-6">
                  {(error || success) && (
                    <div
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

                  <form
                    onSubmit={handleSaveProfile}
                    className="rounded-[28px] border border-white/10 bg-[#111214]/90 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-xl"
                  >
                    <h2 className="text-xl font-semibold text-white">
                      Informações pessoais
                    </h2>

                    <p className="mt-1 text-sm text-zinc-400">
                      Atualize o nome exibido na plataforma.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field label="Nome completo" htmlFor="name">
                        <div className="relative">
                          <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSavingProfile}
                            className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-[#d4af37]/50 focus:ring-2 focus:ring-[#d4af37]/15 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </div>
                      </Field>

                      <Field label="E-mail" htmlFor="email">
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            disabled
                            className="h-12 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-zinc-400 outline-none"
                          />
                        </div>
                      </Field>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSavingProfile}
                      className="mt-6 h-12 rounded-2xl bg-[#d4af37] px-6 text-sm font-semibold text-black hover:bg-[#c9a633] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingProfile ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          Salvando...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Save className="size-4" />
                          Salvar perfil
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
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

function ProfileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-zinc-200">
        {value}
      </p>
    </div>
  )
}

function traduzirErroPerfil(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes("jwt") || normalized.includes("session")) {
    return "Sua sessão expirou. Faça login novamente."
  }

  if (
    normalized.includes("too many requests") ||
    normalized.includes("rate limit") ||
    normalized.includes("rate")
  ) {
    return "Muitas tentativas foram feitas. Aguarde alguns minutos e tente novamente."
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("fetch")
  ) {
    return "Não foi possível conectar ao servidor. Verifique sua internet."
  }

  return "Não foi possível atualizar o perfil. Tente novamente."
}