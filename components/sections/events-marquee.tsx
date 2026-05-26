"use client"

function MarqueeRow({
  images,
  direction,
}: {
  images: string[]
  direction: "left" | "right"
}) {
  if (images.length === 0) return null

  const loop = [...images, ...images]
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
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}

export function EventsMarquee({
  images,
  rowBImages,
}: {
  images: string[]
  rowBImages: string[]
}) {
  if (images.length === 0) {
    return (
      <p className="text-center text-sm text-slate-10">
        Add photos to <code className="text-slate-11">public/slideshow/</code> to populate this section.
      </p>
    )
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 md:gap-6">
      <MarqueeRow images={images} direction="left" />
      <MarqueeRow images={rowBImages} direction="right" />
    </div>
  )
}
