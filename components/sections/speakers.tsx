"use client"

import { motion } from "framer-motion"
import { Linkedin } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

type PastSpeaker = {
  name: string
  title: string
  img: string
  logo: string
  linkedin: string
}

export function PastSpeakersSection() {
  const speakers: PastSpeaker[] = [
    {
      name: "Dean Stoecker",
      title: "Founder & Former CEO, Alteryx",
      img: "/dean-stoecker.jpeg",
      logo: "/alteryx-logo.webp",
      linkedin: "https://www.linkedin.com/in/dean-stoecker-298010a",
    },
    {
      name: "Michael Morhaime",
      title: "Co-Founder & Former CEO, Blizzard Entertainment",
      img: "/michael-morhaime.jpeg",
      logo: "/blizzard-logo.png",
      linkedin: "https://www.linkedin.com/in/mike-morhaime-1081a7170",
    },
    {
      name: "Timothy Li",
      title: "Founder & CEO, LendAPI",
      img: "/timothy-li.avif",
      logo: "/LendAPI.webp",
      linkedin: "https://www.linkedin.com/in/timothytli",
    },
    {
      name: "Karni Baghdikian",
      title: "Former CMO, Ring",
      img: "/karni-baghdikian.jpeg",
      logo: "/ring.png",
      linkedin: "https://www.linkedin.com/in/karnib",
    },
    {
      name: "Michael Yan",
      title: "Founder & CEO, Simplify",
      img: "/michael-yan.jpeg",
      logo: "/simplify.png",
      linkedin: "https://www.linkedin.com/in/myan",
    },
  ]

  return (
    <section id="speakers" className="py-16 md:py-24 px-5">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center space-y-3 mb-10">
            <h2 className="text-4xl md:text-5xl font-medium text-slate-12 tracking-tight">Past Speakers</h2>
            <p className="text-slate-11 text-base md:text-lg">Founders, operators, and investors who’ve joined us.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {speakers.map((s, i) => (
            <motion.div
              key={s.name}
              className={`rounded-2xl border border-slate-6 bg-slate-1 p-5 md:p-6 text-center md:col-span-2 ${
                i === speakers.length - 2 ? "md:col-start-2" : ""
              }`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <img
                src={s.img || "/placeholder.svg"}
                alt={`${s.name} headshot`}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto mb-3 bg-slate-3"
              />
              <div className="text-slate-12 font-medium text-base md:text-lg">{s.name}</div>
              <div className="text-slate-10 text-sm md:text-base">{s.title}</div>
              <a
                href={s.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-slate-6 bg-slate-2 px-3 py-1.5 text-xs font-medium text-slate-11 transition-colors hover:border-slate-8 hover:bg-slate-3 hover:text-slate-12"
                aria-label={`${s.name} on LinkedIn`}
              >
                <Linkedin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                LinkedIn
              </a>
              <img
                src={s.logo || "/placeholder.svg"}
                alt={`${s.name} company logo`}
                className="h-8 md:h-10 object-contain mx-auto mt-4 opacity-80"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
