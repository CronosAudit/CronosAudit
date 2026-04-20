"use client"

import React from "react"
import Link from "next/link"
import { Menu, X, Hourglass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const menuItems = [
  { name: "Soluções", href: "/#solucoes" },
  { name: "Recursos", href: "/#recursos" },
  { name: "Governança", href: "/#governanca" },
  { name: "Planos", href: "/planos" },
  { name: "Contato", href: "/#contato" },
  { name: "Chat", href: "/chat" },
]

export function Header() {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="group fixed z-50 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-4 transition-all duration-300 sm:px-6 lg:px-8",
            isScrolled &&
              "max-w-5xl rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center">
                <Logo />
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-2 block cursor-pointer p-2.5 text-white lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 scale-0 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-8 text-sm">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-zinc-300 transition duration-150 hover:text-[#f4e7b2]"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 bg-[#121214] p-6 shadow-2xl shadow-black/30 group-data-[state=active]:block md:flex-nowrap lg:mb-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-zinc-300 transition duration-150 hover:text-[#f4e7b2]"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white",
                    isScrolled && "lg:hidden"
                  )}
                >
                  <Link href="/#contato">
                    <span>Falar com especialista</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "bg-[#d4af37] text-black hover:bg-[#c9a633]",
                    isScrolled && "lg:hidden"
                  )}
                >
                  <Link href="/#solucoes">
                    <span>Ver plataforma</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  size="sm"
                  className={cn(
                    "hidden bg-[#d4af37] text-black hover:bg-[#c9a633]",
                    isScrolled && "lg:inline-flex"
                  )}
                >
                  <Link href="/#contato">
                    <span>Agendar demo</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
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
