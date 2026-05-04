import type { Metadata } from "next"
import { HomePageWrapper } from "@/components/home-page-wrapper"
import { Header } from "@/components/header"
// import { ApplyCTA } from "@/components/apply-cta"
import { HeroSection } from "@/components/sections/hero"
import { ProgramsSection } from "@/components/sections/programs"
import { MetricsSection } from "@/components/sections/metrics"
// import { ElevateSection } from "@/components/sections/elevate"
import { EventsSection } from "@/components/sections/events"
import { ShowcaseSection } from "@/components/sections/showcase"
import { PastSpeakersSection } from "@/components/sections/speakers"
import { BoardSection } from "@/components/sections/board"
import { SponsorsSection } from "@/components/sections/sponsors"
import { TestimonialsSection } from "@/components/sections/testimonials"
import { FAQSection } from "@/components/sections/faq"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Manifest at UCI - Premier Entrepreneurship Community",
  description:
    "The selective, high-energy community of student builders at UC Irvine. Apply to join our cohort of founders, engineers, and creators.",
}

export default async function Page() {
  return (
    <HomePageWrapper>
      <Header />
      {/* <ApplyCTA /> */}

      {/* Above-the-fold: hero + social proof */}
      <HeroSection />
      <MetricsSection />
      {/* <SponsorsSection /> */}

      {/* Core value + social proof (compact) */}
      <ProgramsSection />
      <PastSpeakersSection />
      <ShowcaseSection />

      {/* Condensed Elevate + Events */}
      {/* <ElevateSection /> */}
      <EventsSection />

      {/* Credibility + questions */}
      <BoardSection />
      <TestimonialsSection />
      {/* <FAQSection /> */}

      <Footer />
    </HomePageWrapper>
  )
}
