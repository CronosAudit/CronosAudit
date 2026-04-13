"use client";

import Link from "next/link";
import { Hourglass, MessageSquare, Home, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl shadow-lg shadow-black/20">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/30 bg-gradient-to-br from-[#d4af37]/20 via-[#b88746]/10 to-transparent text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
            <Hourglass className="size-5" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[0.22em] text-[#f4e7b2]">
              Chronos
            </p>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
              Audit
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink href="/" icon={<Home className="size-4" />}>
            Início
          </NavLink>

          <NavLink href="/chat" icon={<MessageSquare className="size-4" />}>
            Chat
          </NavLink>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-2 text-xs text-[#f4e7b2]">
            <Sparkles className="size-3.5" />
            IA Assistiva
          </span>
        </nav>

        <div className="sm:hidden">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 transition hover:bg-white/10 hover:text-white"
          >
            Voltar
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}