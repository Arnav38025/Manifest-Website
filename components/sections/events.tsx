import { FadeIn } from "@/components/ui/fade-in"
import { getCommunitySlideshowImages, getCommunitySlideshowRowB } from "@/lib/community-slideshow"
import { EventsMarquee } from "@/components/sections/events-marquee"

export function EventsSection() {
  const eventImages = getCommunitySlideshowImages()
  const rowBImages = getCommunitySlideshowRowB(eventImages)

  return (
    <section id="events" className="overflow-hidden px-5 py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-6xl md:mb-14">
        <FadeIn>
          <div className="space-y-3 text-center md:space-y-5">
            <h2 className="text-4xl font-medium tracking-tight text-slate-12 md:text-5xl">Our Community in Action</h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-11 md:text-xl">
              A rolling snapshot of what building together looks like.
            </p>
          </div>
        </FadeIn>
      </div>

      <EventsMarquee images={eventImages} rowBImages={rowBImages} />
    </section>
  )
}
