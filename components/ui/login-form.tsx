"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"

type AuthFormProps = {
  mode: "login" | "signup"
  email: string
  password: string
  name?: string
  confirmPassword?: string
  rememberMe?: boolean
  acceptedTerms?: boolean
  error?: string
  success?: string
  isLoading?: boolean
  isGoogleLoading?: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onNameChange?: (value: string) => void
  onConfirmPasswordChange?: (value: string) => void
  onRememberMeChange?: (value: boolean) => void
  onAcceptedTermsChange?: (value: boolean) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onGoogleLogin?: () => void
}

export function AuthScreen(props: AuthFormProps) {
  const isSignup = props.mode === "signup"
  const disabled = props.isLoading || props.isGoogleLoading

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <SmokeyBackground color="#ffc65c" />

      <div className="absolute inset-0 bg-grid opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,198,92,0.12),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.15),#000)]" />

      <section className="relative z-10 flex h-full w-full items-center justify-center px-4 py-4 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[1fr_420px]">
          <div className="hidden lg:block">
            <div className="inline-flex rounded-full border border-[var(--accent-amber-border)] bg-[var(--accent-amber-soft)] px-4 py-2 text-sm text-[#fff1c7]">
              Chronos Audit
            </div>

            <h1 className="mt-6 max-w-2xl text-6xl font-semibold leading-[0.95] text-display">
              Auditoria com{" "}
              <span className="text-gradient-amber">clareza, segurança e IA.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--text-300)]">
              Acesse documentos, relatórios, evidências e fluxos inteligentes em
              uma interface protegida e rastreável.
            </p>
          </div>

          <AuthCard {...props} disabled={disabled} isSignup={isSignup} />
        </div>
      </section>
    </main>
  )
}

function AuthCard(props: AuthFormProps & { disabled?: boolean; isSignup: boolean }) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[2rem] border border-white/15 bg-white/[0.08] p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-7">
      <div className="mb-5 text-center">
        <p className="text-sm font-medium text-[#ffc65c]">
          {props.isSignup ? "Inscreva-se" : "Login"}
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {props.isSignup ? "Criar conta" : "Bem-vindo de volta"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {props.isSignup
            ? "Comece sua experiência no Chronos Audit."
            : "Entre para continuar no Chronos Audit."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={props.onSubmit}>
        {props.isSignup && (
          <FloatingInput
            id="name"
            label="Nome completo"
            icon={<User size={16} />}
            value={props.name ?? ""}
            onChange={(e) => props.onNameChange?.(e.target.value)}
            disabled={props.disabled}
            autoComplete="name"
          />
        )}

        <FloatingInput
          id="email"
          label="E-mail"
          icon={<Mail size={16} />}
          type="email"
          value={props.email}
          onChange={(e) => props.onEmailChange(e.target.value)}
          disabled={props.disabled}
          autoComplete="email"
        />

        <FloatingInput
          id="password"
          label="Senha"
          icon={<Lock size={16} />}
          type={showPassword ? "text" : "password"}
          value={props.password}
          onChange={(e) => props.onPasswordChange(e.target.value)}
          disabled={props.disabled}
          autoComplete={props.isSignup ? "new-password" : "current-password"}
          rightAction={
            <PasswordToggle
              show={showPassword}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        {props.isSignup && (
          <FloatingInput
            id="confirmPassword"
            label="Confirmar senha"
            icon={<Lock size={16} />}
            type={showConfirmPassword ? "text" : "password"}
            value={props.confirmPassword ?? ""}
            onChange={(e) => props.onConfirmPasswordChange?.(e.target.value)}
            disabled={props.disabled}
            autoComplete="new-password"
            rightAction={
              <PasswordToggle
                show={showConfirmPassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              />
            }
          />
        )}

        {!props.isSignup ? (
          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-zinc-300">
              <input
                type="checkbox"
                checked={props.rememberMe}
                onChange={(e) => props.onRememberMeChange?.(e.target.checked)}
                className="size-4 accent-[#ffc65c]"
              />
              Lembrar e-mail
            </label>

            <Link href="/forgot-password" className="text-[#ffc65c] hover:opacity-80">
              Esqueci a senha
            </Link>
          </div>
        ) : (
          <label className="flex items-start gap-2 text-xs leading-5 text-zinc-300">
            <input
              type="checkbox"
              checked={props.acceptedTerms}
              onChange={(e) => props.onAcceptedTermsChange?.(e.target.checked)}
              className="mt-0.5 size-4 accent-[#ffc65c]"
            />
            Aceito os termos de uso e a política de privacidade.
          </label>
        )}

        {(props.error || props.success) && (
          <div
            className={`rounded-xl border px-3 py-2 text-sm ${
              props.error
                ? "border-red-500/25 bg-red-500/10 text-red-200"
                : "border-emerald-500/25 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {props.error || props.success}
          </div>
        )}

        <Button
          type="submit"
          disabled={props.disabled}
          className="h-11 w-full rounded-xl bg-[#ffc65c] font-semibold text-black hover:bg-[#ffd078]"
        >
          {props.isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              {props.isSignup ? "Criando..." : "Entrando..."}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              {props.isSignup ? "Criar conta" : "Entrar"}
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/15" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">ou</span>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={props.onGoogleLogin}
        disabled={props.disabled}
        className="h-11 w-full rounded-xl border-white/15 bg-white/90 font-semibold text-zinc-800 hover:bg-white"
      >
        {props.isGoogleLoading ? "Conectando..." : "Continuar com Google"}
      </Button>

      <p className="mt-5 text-center text-sm text-zinc-400">
        {props.isSignup ? "Já possui conta?" : "Ainda não tem conta?"}{" "}
        <Link
          href={props.isSignup ? "/login" : "/signup"}
          className="font-semibold text-[#ffc65c] hover:opacity-80"
        >
          {props.isSignup ? "Entrar" : "Inscreva-se"}
        </Link>
      </p>
    </div>
  )
}

function FloatingInput({
  label,
  icon,
  rightAction,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: React.ReactNode
  rightAction?: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-2.5 text-zinc-400">
        {icon}
      </div>

      <input
        {...props}
        placeholder=" "
        className="peer block h-11 w-full border-0 border-b border-white/25 bg-transparent pl-7 pr-10 text-sm text-white outline-none transition placeholder:text-transparent focus:border-[#ffc65c] disabled:opacity-60"
      />

      <label
        htmlFor={props.id}
        className="pointer-events-none absolute left-7 top-2.5 text-sm text-zinc-400 transition-all peer-focus:-top-3 peer-focus:left-0 peer-focus:text-xs peer-focus:text-[#ffc65c] peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>

      {rightAction && <div className="absolute right-0 top-2.5">{rightAction}</div>}
    </div>
  )
}

function PasswordToggle({
  show,
  onClick,
}: {
  show: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="text-zinc-400 hover:text-white">
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )
}

function SmokeyBackground({
  color = "#ffc65c",
}: {
  color?: string
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute -inset-[20%] opacity-70 blur-3xl"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, ${color}33, transparent 30%),
            radial-gradient(circle at 80% 30%, rgba(116,200,252,0.18), transparent 28%),
            radial-gradient(circle at 50% 80%, rgba(255,198,92,0.16), transparent 34%)
          `,
        }}
      />
      <div className="absolute inset-0 animate-[smokeMove_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_32%)]" />
    </div>
  )
}