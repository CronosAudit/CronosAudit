import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { Analytics } from "@vercel/analytics/next"
import Footer4Col from "@/components/ui/footer-column"

const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505] text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-30 mix-blend-screen sepia-[0.5] hue-rotate-[330deg] saturate-[1.35] brightness-[0.75]"
          src={HERO_VIDEO_URL}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,215,120,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,190,80,0.14),transparent_24%),linear-gradient(to_bottom,rgba(0,0,0,0.45),#050505_92%)]" />

        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <Footer4Col />
      </div>

      <Analytics />
    </main>
  )
}