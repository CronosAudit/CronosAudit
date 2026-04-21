"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Hourglass,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

export type NavItem = {
  name: string
  href: string
}

type NavbarProps = {
  menuItems?: NavItem[]
  showAuthButtons?: boolean
  showContactButtonMobile?: boolean
  contactHref?: string
  className?: string
  userName?: string
  userEmail?: string
  showUserMenu?: boolean
  dashboardHref?: string
  profileHref?: string
  onLogout?: () => void | Promise<void>
}

export const defaultMenuItems: NavItem[] = [
  { name: "Soluções", href: "/solucoes" },
  { name: "Recursos", href: "/recursos" },
  { name: "Governança", href: "/governanca" },
  { name: "Contato", href: "/contato" },
  { name: "Chat", href: "/chat" },
]

export const dashboardMenuItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Chat", href: "/chat" },
  { name: "Relatórios", href: "/relatorios" },
  { name: "Documentos Exemplo", href: "/dashboard/documentos" },
]

type ResolvedUser = {
  name: string
  email: string
}

export function Navbar({
  menuItems = defaultMenuItems,
  showAuthButtons = true,
  showContactButtonMobile = true,
  contactHref = "/contato",
  className,
  userName,
  userEmail,
  showUserMenu,
  dashboardHref = "/dashboard",
  profileHref = "/perfil",
  onLogout,
}: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [menuOpen, setMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [authUser, setAuthUser] = React.useState<ResolvedUser | null>(null)
  const [isLoadingUser, setIsLoadingUser] = React.useState(true)

  const userMenuRef = React.useRef<HTMLDivElement | null>(null)

  const loadAuthenticatedUser = React.useCallback(async () => {
    try {
      setIsLoadingUser(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setAuthUser(null)
        return
      }

      const email = user.email?.trim() || ""
      const metadataName =
        typeof user.user_metadata?.name === "string"
          ? user.user_metadata.name.trim()
          : ""
      const metadataFullName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : ""

      let profileName = ""
      let profileEmail = ""

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, email")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        profileName =
          typeof profile.name === "string" ? profile.name.trim() : ""
        profileEmail =
          typeof profile.email === "string" ? profile.email.trim() : ""
      }

      const finalName =
        userName?.trim() ||
        profileName ||
        metadataName ||
        metadataFullName ||
        email ||
        "Usuário"

      const finalEmail = userEmail?.trim() || profileEmail || email || ""

      setAuthUser({
        name: finalName,
        email: finalEmail,
      })
    } catch (error) {
      console.error("Erro ao carregar usuário autenticado na Navbar:", error)
      setAuthUser(null)
    } finally {
      setIsLoadingUser(false)
    }
  }, [userEmail, userName])

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  React.useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  React.useEffect(() => {
    loadAuthenticatedUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setAuthUser(null)
        setIsLoadingUser(false)
        return
      }

      const email = session.user.email?.trim() || ""
      const metadataName =
        typeof session.user.user_metadata?.name === "string"
          ? session.user.user_metadata.name.trim()
          : ""
      const metadataFullName =
        typeof session.user.user_metadata?.full_name === "string"
          ? session.user.user_metadata.full_name.trim()
          : ""

      let profileName = ""
      let profileEmail = ""

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", session.user.id)
          .maybeSingle()

        if (profile) {
          profileName =
            typeof profile.name === "string" ? profile.name.trim() : ""
          profileEmail =
            typeof profile.email === "string" ? profile.email.trim() : ""
        }
      } catch (error) {
        console.error("Erro ao sincronizar usuário da Navbar:", error)
      }

      setAuthUser({
        name:
          userName?.trim() ||
          profileName ||
          metadataName ||
          metadataFullName ||
          email ||
          "Usuário",
        email: userEmail?.trim() || profileEmail || email || "",
      })

      setIsLoadingUser(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadAuthenticatedUser, userEmail, userName])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false)
      setMenuOpen(false)

      if (onLogout) {
        await onLogout()
      } else {
        await supabase.auth.signOut()
        setAuthUser(null)
        router.push("/login")
        router.refresh()
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const isActiveLink = (href: string) => {
    if (!href.startsWith("/")) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const resolvedName = userName?.trim() || authUser?.name || ""
  const resolvedEmail = userEmail?.trim() || authUser?.email || ""

  const hasUser = Boolean(resolvedName || resolvedEmail)
  const shouldShowUserMenu = showUserMenu ?? hasUser

  const initial =
    resolvedName?.charAt(0)?.toUpperCase() ||
    resolvedEmail?.charAt(0)?.toUpperCase() ||
    "U"

  const displayName = resolvedName || resolvedEmail || "Usuário"
  const displaySubtext = resolvedEmail || "Painel do usuário"

  return (
    <header className={cn("relative z-50", className)}>
      <nav className="fixed inset-x-0 top-0 px-2 pt-2">
        <div
          className={cn(
            "mx-auto max-w-6xl rounded-2xl border border-transparent px-4 transition-all duration-300 sm:px-6 lg:px-8",
            isScrolled &&
              "border-white/10 bg-black/45 shadow-lg shadow-black/20 backdrop-blur-xl"
          )}
        >
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href={shouldShowUserMenu ? dashboardHref : "/"}
              aria-label="Ir para a página inicial"
              className="flex items-center"
            >
              <Logo />
            </Link>

            <div className="hidden lg:flex">
              <ul className="flex items-center gap-8 text-sm">
                {menuItems.map((item) => {
                  const active = isActiveLink(item.href)

                  return (
                    <li key={`${item.name}-${item.href}`}>
                      <Link
                        href={item.href}
                        className={cn(
                          "transition duration-150 hover:text-[#f4e7b2]",
                          active ? "text-[#f4e7b2]" : "text-zinc-300"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {shouldShowUserMenu ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-label="Abrir menu do usuário"
                    aria-expanded={userMenuOpen}
                    className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left text-white transition hover:bg-white/10"
                  >
                    <div className="flex size-9 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-sm font-semibold text-[#f4e7b2]">
                      {initial}
                    </div>

                    <div className="max-w-[180px] leading-tight">
                      <p className="truncate text-sm font-medium text-white">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {displaySubtext}
                      </p>
                    </div>

                    <ChevronDown
                      className={cn(
                        "size-4 text-zinc-400 transition-transform duration-200",
                        userMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-[#121214] p-2 shadow-2xl shadow-black/30">
                      <div className="mb-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="truncate text-sm font-medium text-white">
                          {displayName}
                        </p>
                        <p className="mt-1 truncate text-xs text-zinc-400">
                          {displaySubtext}
                        </p>
                      </div>

                      <Link
                        href={dashboardHref}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-white/5 hover:text-[#f4e7b2]",
                          isActiveLink(dashboardHref)
                            ? "bg-white/5 text-[#f4e7b2]"
                            : "text-zinc-200"
                        )}
                      >
                        <Hourglass className="size-4" />
                        Dashboard
                      </Link>

                      <Link
                        href={profileHref}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-white/5 hover:text-[#f4e7b2]",
                          isActiveLink(profileHref)
                            ? "bg-white/5 text-[#f4e7b2]"
                            : "text-zinc-200"
                        )}
                      >
                        <User className="size-4" />
                        Meu perfil
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
                      >
                        <LogOut className="size-4" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                !isLoadingUser &&
                showAuthButtons && (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href="/login">Login</Link>
                    </Button>

                    <Button
                      asChild
                      size="sm"
                      className="bg-[#d4af37] text-black hover:bg-[#c9a633]"
                    >
                      <Link href="/signup">Inscreva-se</Link>
                    </Button>
                  </>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 top-0 bg-black/70 backdrop-blur-sm"
              onClick={closeMenu}
            />

            <div className="absolute left-2 right-2 top-[4.5rem] mx-auto max-w-6xl rounded-2xl border border-white/10 bg-[#121214] p-5 shadow-2xl shadow-black/30">
              {shouldShowUserMenu && (
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/10 text-sm font-semibold text-[#f4e7b2]">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {displaySubtext}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActiveLink(item.href)

                  return (
                    <li key={`${item.name}-${item.href}`}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-3 py-3 text-base transition hover:bg-white/5 hover:text-[#f4e7b2]",
                          active ? "bg-white/5 text-[#f4e7b2]" : "text-zinc-200"
                        )}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="size-4 opacity-60" />
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 grid gap-3">
                {shouldShowUserMenu ? (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                    >
                      <Link href={profileHref} onClick={closeMenu}>
                        Meu perfil
                      </Link>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleLogout}
                      className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    >
                      Sair
                    </Button>
                  </>
                ) : (
                  !isLoadingUser &&
                  showAuthButtons && (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        className="text-white hover:bg-white/10 hover:text-white"
                      >
                        <Link href="/login" onClick={closeMenu}>
                          Login
                        </Link>
                      </Button>

                      {showContactButtonMobile && (
                        <Button
                          asChild
                          variant="outline"
                          className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        >
                          <Link href={contactHref} onClick={closeMenu}>
                            Falar com especialista
                          </Link>
                        </Button>
                      )}

                      <Button
                        asChild
                        className="bg-[#d4af37] text-black hover:bg-[#c9a633]"
                      >
                        <Link href="/signup" onClick={closeMenu}>
                          Inscreva-se
                        </Link>
                      </Button>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
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
    </div>
  )
}