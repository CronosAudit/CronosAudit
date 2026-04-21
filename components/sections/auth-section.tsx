"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hourglass,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthSectionProps {
  mode: AuthMode;
}

export function AuthSection({ mode }: AuthSectionProps) {
  const isLogin = mode === "login";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const title = useMemo(
    () => (isLogin ? "Acesse sua conta" : "Crie sua conta"),
    [isLogin]
  );

  const subtitle = useMemo(
    () =>
      isLogin
        ? "Entre na plataforma para acompanhar auditorias, evidências, rastreabilidade e análises com IA."
        : "Comece a usar o Chronos Audit para centralizar documentação, governança, conformidade e apoio inteligente à auditoria.",
    [isLogin]
  );

  const passwordChecks = {
    length: true,
    upper: true,
    number: true,
  };

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.10),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.02),_transparent_30%,_rgba(255,255,255,0.01))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <section className="flex w-full flex-col justify-between px-6 py-8 sm:px-8 lg:w-1/2 lg:px-12 lg:py-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl transition hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 via-[#b88746]/10 to-transparent text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
                <Hourglass className="h-5 w-5" />
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold tracking-wide text-white">
                  Chronos Audit
                </p>
                <p className="text-xs text-white/60">
                  IA para auditoria com governança
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-14 max-w-xl lg:mt-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-xs font-medium text-[#f5d97b]">
              <Sparkles className="h-3.5 w-3.5" />
              Plataforma inteligente para auditoria e compliance
            </div>

            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              {subtitle}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Governança"
                description="Fluxos mais seguros e confiáveis."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Rastreabilidade"
                description="Histórico claro de ações e evidências."
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5" />}
                title="IA Responsável"
                description="Assistência com contexto e conformidade."
              />
            </div>
          </div>

          <div className="mt-12 hidden text-sm text-white/40 lg:block">
            © {new Date().getFullYear()} Chronos Audit. Todos os direitos reservados.
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-6 pb-8 pt-2 sm:px-8 lg:w-1/2 lg:px-12 lg:py-10">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">
                {isLogin ? "Entrar" : "Criar conta"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/60">
                {isLogin
                  ? "Use seu e-mail corporativo ou credencial cadastrada."
                  : "Preencha seus dados para começar a utilizar a plataforma."}
              </p>
            </div>

            <form className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-white/80"
                  >
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-white/80"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-white/80"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "Digite sua senha" : "Crie uma senha forte"}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/80"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-white/80"
                    >
                      Confirmar senha
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-black/30 pl-11 pr-12 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#d4af37]/40 focus:ring-2 focus:ring-[#d4af37]/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white/80"
                        aria-label={
                          showConfirmPassword
                            ? "Ocultar confirmação de senha"
                            : "Mostrar confirmação de senha"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                      Requisitos da senha
                    </p>

                    <div className="grid gap-2">
                      <Rule active={passwordChecks.length}>
                        Pelo menos 8 caracteres
                      </Rule>
                      <Rule active={passwordChecks.upper}>
                        Pelo menos 1 letra maiúscula
                      </Rule>
                      <Rule active={passwordChecks.number}>
                        Pelo menos 1 número
                      </Rule>
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex items-center gap-2 text-sm text-white/65">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-transparent"
                    />
                    Lembrar de mim
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#f5d97b] transition hover:text-[#ffe9a3]"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
              )}

              {!isLogin && (
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/65">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                  />
                  <span>
                    Concordo com os termos de uso e com a política de privacidade
                    da plataforma.
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#e1c15a] to-[#b88746] px-5 text-sm font-semibold text-black transition hover:scale-[1.01] hover:shadow-lg hover:shadow-[#d4af37]/20"
              >
                {isLogin ? "Entrar na plataforma" : "Criar conta"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                ou
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/85 transition hover:bg-white/[0.06]"
            >
              Continuar com conta corporativa
            </button>

            <p className="mt-6 text-center text-sm text-white/55">
              {isLogin ? "Ainda não tem uma conta?" : "Já possui uma conta?"}{" "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="font-medium text-[#f5d97b] transition hover:text-[#ffe9a3]"
              >
                {isLogin ? "Criar conta" : "Fazer login"}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-[#f5d97b]">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
    </div>
  );
}

function Rule({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/70">
      <CheckCircle2
        className={`h-4 w-4 ${active ? "text-emerald-400" : "text-white/20"}`}
      />
      <span>{children}</span>
    </div>
  );
}