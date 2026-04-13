import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}