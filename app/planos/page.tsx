import { Header } from "@/components/sections/header"
import { PricingSection } from "@/components/sections/pricing-section"
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function PlanosPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0b0b0c] text-white overflow-hidden">
      <Header />
      
      <div className="relative pt-20">
        {/* Background Pattern consistent with Home */}
        <div className="absolute inset-0 -z-20">
          <BackgroundPaths />
        </div>

        <div className="absolute inset-0 -z-10 bg-[#0b0b0c]/88" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-[-8rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.06)_35%,transparent_72%)] blur-3xl" />
          <div className="absolute right-[-10rem] top-[10rem] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(120,119,108,0.14)_0%,rgba(120,119,108,0.06)_40%,transparent_75%)] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_100%,transparent_0%,#0b0b0c_62%)]" />
        </div>

        <PricingSection />
      </div>
    </main>
  )
}
