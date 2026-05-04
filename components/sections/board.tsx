"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useMemo, useState } from "react"
import { FadeIn } from "@/components/ui/fade-in"
import { ChevronDown, Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

type Member = {
  name: string
  role: string
  year: string
  major: string
  bio: string
  image: string
  socials: Record<string, string>
  achievements: string[]
}

const NEW_BOARD_HEADSHOTS: Record<string, string> = {
  "Meera Phadnis": "/newBoard/meera.jpeg",
  "Meher Dhingra": "/newBoard/Meher.jpg",
  "Cozette Lessor": "/newBoard/cozy.jpeg",
  "Isabella Carrillo": "/newBoard/Isabella.JPG",
  "Hanna Hu": "/newBoard/hanna.jpeg",
  "Arnav Saharan": "/newBoard/Arnav.jpg",
  "Sahil Kulkarni": "/newBoard/sahil.jpeg",
  "Brandon Yee": "/newBoard/brandon.jpeg",
  "Aurelio Metta": "/newBoard/aurelio.jpeg",
}

/** Prefer `public/newBoard/*` for current board photos, fallback to legacy root image. */
function boardHeadshot(fullName: string): string {
  const mapped = NEW_BOARD_HEADSHOTS[fullName]
  if (mapped) return mapped
  const first = fullName.trim().split(/\s+/)[0]?.toLowerCase() ?? "placeholder"
  return `/${first}.jpeg`
}



const leadershipMembers: Member[] = [
  {
    name: "Meera Phadnis",
    role: "President",
    year: "Sophomore",
    major: "Data Science, Economics",
    bio: "",
    image: boardHeadshot("Meera Phadnis"),
    socials: {
      linkedin: "https://www.linkedin.com/in/meeraphadnis",
    },
    achievements: [
      "Former VP of Marketing",
      "Hackathon Winner",
      "Intern @ CARPE-Ecosattva",
      "Undergraduate Researcher @ UCI",
      "Currently building in stealth",
    ],
  },
  {
    name: "Cozette Lessor",
    role: "Vice President",
    year: "Freshman",
    major: "Pre-Law",
    bio: "",
    image: boardHeadshot("Cozette Lessor"),
    socials: {
      linkedin: "https://www.linkedin.com/in/cozette-lessor",
    },
    achievements: [
      "Founder of Covered Girl",
      "Founder of Airbnb Arbitrage Business",
      "Serial Entrepreneur",
      "Pre-Law @ UCI",
      "VP @ Manifest",
    ],
  },
  {
    name: "Meher Dhingra",
    role: "VP of Finance",
    year: "Freshman",
    major: "Economics",
    bio: "",
    image: boardHeadshot("Meher Dhingra"),
    socials: {
      linkedin: "https://www.linkedin.com/in/meherdhingra/",
    },
    achievements: [
      "Co-VP of Marketing @ Venture Capital Society",
      "Building in Fintech",
      "Prev Intern @ TimeZone",
      "Prev Intern @ Limited Edt",
    ],
  },
]

const archivedMembers: Member[] = [
  {
    name: "Isabella Carrillo",
    role: "VP of Marketing",
    year: "Sophomore",
    major: "Business Administration, Emphasis in Finance",
    bio: "",
    image: boardHeadshot("Isabella Carrillo"),
    socials: {
      linkedin: "https://www.linkedin.com/in/isabella-carrillo-22ab41391",
    },
    achievements: ["Intern @ Northwestern Mutual", "Intern @ Modern Woodmen"],
  },
  {
    name: "Hanna Hu",
    role: "VP of Communications",
    year: "Freshman",
    major: "Electrical Engineering, Minor in Biomedical Engineering",
    bio: "",
    image: boardHeadshot("Hanna Hu"),
    socials: {
      linkedin: "https://www.linkedin.com/in/hannajhu",
    },
    achievements: [
      "Science Life-Detection Engineering @ Legacy Robotics",
      "Currently building Scrivia.health",
    ],
  },
  {
    name: "Arnav Saharan",
    role: "VP of Technology",
    year: "Sophomore",
    major: "Computer Science",
    bio: "",
    image: boardHeadshot("Arnav Saharan"),
    socials: {
      linkedin: "https://www.linkedin.com/in/arnav-saharan-b94967211/",
    },
    achievements: ["Currently building Krumbit", "Software Analyst @ Goldman Sachs"],
  },
  {
    name: "Sahil Kulkarni",
    role: "VP of External",
    year: "Sophomore",
    major: "Computer Engineering",
    bio: "",
    image: boardHeadshot("Sahil Kulkarni"),
    socials: {
      linkedin: "https://www.linkedin.com/in/sahil-kulkarni",
    },
    achievements: [
      "Previous intern of marketing",
      "Design and pitch competition runner-up",
      "Currently building in tech",
    ],
  },
  {
    name: "Brandon Yee",
    role: "Co-VP of Internal",
    year: "Sophomore",
    major: "CS + BIM",
    bio: "",
    image: boardHeadshot("Brandon Yee"),
    socials: {
      linkedin:
        "https://www.linkedin.com/in/brandon-yee-5b4618324?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    },
    achievements: ["APM @ ZotSun", "Team Lead @ CubeSat UCI"],
  },
  {
    name: "Aurelio Metta",
    role: "Co-VP of Internal",
    year: "Freshman",
    major: "Business Administration + Psychology",
    bio: "",
    image: boardHeadshot("Aurelio Metta"),
    socials: {
      linkedin: "https://www.linkedin.com/in/aureliometta",
    },
    achievements: [
      "ItalianVisa Project Manager",
      "PROTOTYPE Co-Founder",
      "Indigo TCG Founder | 6-fig value @ 14y/o",
      "ThoughtCentral Founder | 300k TikTok",
    ],
  },
]

function socialHref(url: string) {
  return url.startsWith("http") ? url : `https://${url}`
}

function MemberCard({
  member,
  index,
  expanded,
  onToggle,
}: {
  member: Member
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  const hasAchievements = member.achievements.length > 0

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <motion.div
      className={cn(
        "group relative z-0 cursor-default overflow-hidden rounded-3xl border border-slate-6 bg-slate-1 p-6 transition-all duration-300 md:p-8",
        hasAchievements && "cursor-pointer hover:border-slate-8"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      viewport={{ once: true }}
      role={hasAchievements ? "button" : undefined}
      tabIndex={hasAchievements ? 0 : undefined}
      aria-expanded={hasAchievements ? expanded : undefined}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      }}
      onClick={() => {
        if (!hasAchievements) return
        onToggle()
      }}
      onKeyDown={(e) => {
        if (!hasAchievements) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <div className="relative z-[1] mb-5 md:mb-6">
        <motion.div
          className="mx-auto h-40 w-40 overflow-hidden rounded-2xl bg-slate-3 md:h-44 md:w-44 lg:h-48 lg:w-48"
          whileHover={{ scale: 1.06, rotate: 3 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={member.image || "/placeholder-user.jpg"}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      <div className="relative z-[1] space-y-3 text-center">
        <div>
          <div className="flex items-center justify-center gap-1">
            <h3 className="text-xl font-medium text-slate-12 transition-colors group-hover:text-slate-11 md:text-2xl">
              {member.name}
            </h3>
            {hasAchievements ? (
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-slate-10 transition-transform duration-200",
                  expanded && "rotate-180"
                )}
                aria-hidden
              />
            ) : null}
          </div>
          <p className="text-base font-medium text-slate-11">{member.role}</p>
          {member.major ? <p className="mt-1.5 text-sm text-slate-10">{member.major}</p> : null}
        </div>

        {member.bio ? (
          <p className="text-sm leading-relaxed text-slate-11 transition-colors group-hover:text-slate-10">
            {member.bio}
          </p>
        ) : null}

        <AnimatePresence initial={false}>
          {expanded && hasAchievements ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 pt-1 text-left text-sm text-slate-10">
                {member.achievements.map((a, i) => (
                  <li key={`${member.name}-${i}`} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-8" aria-hidden />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {Object.keys(member.socials).length > 0 ? (
          <div className="flex justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
            {Object.entries(member.socials).map(([platform, url]) => (
              <motion.a
                key={platform}
                href={socialHref(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-3 text-slate-11 transition-all duration-200 hover:bg-slate-12 hover:text-slate-1"
                aria-label={`${member.name} on ${platform}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {getSocialIcon(platform)}
              </motion.a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}

function buildLeadershipRoster(): Member[] {
  const current = leadershipMembers.map((m) => ({ ...m, socials: { ...m.socials }, achievements: [...m.achievements] }))
  const names = new Set(current.map((m) => m.name))

  for (const arch of archivedMembers) {
    const cur = current.find((c) => c.name === arch.name)
    if (cur) {
      if (!cur.major && arch.major) cur.major = arch.major
      cur.socials = { ...cur.socials, ...arch.socials }
      if (arch.achievements.length) cur.achievements = [...arch.achievements]
      if (!cur.bio && arch.bio) cur.bio = arch.bio
    }
  }

  const archivedOnly = archivedMembers.filter((a) => !names.has(a.name))

  return [...current, ...archivedOnly]
}

export function BoardSection() {
  const roster = useMemo(() => buildLeadershipRoster(), [])
  const [openCardKey, setOpenCardKey] = useState<string | null>(null)

  return (
    <section
      id="board"
      className="relative overflow-hidden bg-gradient-to-b from-slate-2 via-[#09090b] to-black px-5 py-16 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,rgb(51_65_85_/_0.18),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <FadeIn>
          <div className="mb-10 space-y-6 text-center md:mb-12">
            <h2 className="text-4xl font-medium tracking-tight text-slate-12 sm:text-5xl">
              Meet Our{" "}
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-slate-12 to-slate-10 bg-clip-text text-transparent">
                  Leadership
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-12"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                />
              </motion.span>
            </h2>
          </div>
        </FadeIn>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {roster.map((member, index) => {
            const cardKey = `${member.name}-${member.role}-${index}`
            return (
              <MemberCard
                key={cardKey}
                member={member}
                index={index}
                expanded={openCardKey === cardKey}
                onToggle={() => setOpenCardKey((prev) => (prev === cardKey ? null : cardKey))}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
