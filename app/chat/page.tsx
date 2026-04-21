"use client"

import { ChatSection } from "@/components/sections/chat-section"
import { HeroWave } from "@/components/ui/ai-input-hero"

export default function ChatPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <HeroWave
          showNavbar={false}
          showOverlayContent={false}
          className="h-full min-h-screen w-full"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.10),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0.25),rgba(5,5,5,0.72)_45%,rgba(5,5,5,0.92)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <ChatSection />
      </div>
    </main>
  )
}