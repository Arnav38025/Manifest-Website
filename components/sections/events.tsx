"use client"

import { FadeIn } from "@/components/ui/fade-in"

function MarqueeRow({
  images,
  direction,
}: {
  images: readonly string[]
  direction: "left" | "right"
}) {
  const loop = [...images, ...images] as string[]
  const trackClass =
    direction === "left" ? "events-marquee-track events-marquee-track--left" : "events-marquee-track events-marquee-track--right"

  return (
    <div className="events-marquee-row">
      <div className={trackClass}>
        {loop.map((src, i) => (
          <img
            key={`${direction}-${src}-${i}`}
            src={src}
            alt={`Manifest community — photo ${(i % images.length) + 1} of ${images.length}`}
            className="h-40 w-[13.5rem] shrink-0 select-none rounded-xl border border-slate-6 object-cover shadow-md sm:h-44 sm:w-64 md:h-52 md:w-80"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}

export function EventsSection() {
  const eventImages = [
    "/group_pic.JPG",
    "/IMG_3561.PNG",
    "/IMG_6036.png",
    "/IMG_7656.JPG",
    "/IMG_1708.png",
    "/IMG_2154.png",
  ] as const

  const rowBOrder = [
    eventImages[3],
    eventImages[0],
    eventImages[4],
    eventImages[1],
    eventImages[5],
    eventImages[2],
  ] as const

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

      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:gap-6">
        <MarqueeRow images={eventImages} direction="left" />
        <MarqueeRow images={rowBOrder} direction="right" />
      </div>
    </section>
  )
}
