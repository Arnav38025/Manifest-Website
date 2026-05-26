"use client"

import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/fade-in"

export function TestimonialsSection() {
  const boardMembers = [
    {
      name: "Neal Thakker",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/neal.jpeg",
      socials: {
      },
      achievements: ["Founder & CEO of Magma"],
    },
    {
      name: "Kanu Chandra",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/kanu.jpeg",
      socials: {
      },
      achievements: ["Venture Partner @ V11", "2x Exits"],
    },
    {
      name: "Hana Walsh",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/hana.jpeg",
      socials: {
      },
      achievements: ["Board Advisor @ OOTify"],
    },
    {
      name: "Dylan Riffle",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/dylan.jpeg",
      socials: {
      },
      achievements: ["Co-Founder @ Leprendo", "Venture Associate @ Next Sequence"],
    },
    {
      name: "Steven Guo",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/steven.jpeg",
      socials: {
      },
      achievements: ["Founder @ Manifest Five", "Co-Founder @ Magic 8"],
    },
    {
      name: "Shouryaa Sharma",
      role: "",
      year: "",
      major: "",
      bio: "",
      image: "/shouryaa.jpeg",
      socials: {},
      achievements: ["Former President @ Manifest", "Partner @ Crater Ventures"],
    },
  ]

  const centerLastRowPair = boardMembers.length % 3 === 2

  return (
    <section className="py-16 md:py-24 px-5 bg-slate-2 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-20 left-20 w-40 h-40 bg-slate-4/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl sm:text-5xl font-medium text-slate-12 tracking-tight">
              Manifest{" "}
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-slate-12 to-slate-10 bg-clip-text text-transparent">
                  Alumni
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {boardMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className={`group bg-slate-1 rounded-3xl p-5 md:p-6 border border-slate-6 hover:border-slate-8 transition-all duration-300 cursor-pointer relative overflow-hidden md:col-span-2 ${
                centerLastRowPair && index === boardMembers.length - 2 ? "md:col-start-2" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              {/* Profile Image */}
              <div className="relative mb-4">
                <motion.div
                  className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-3"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                
              </div>

              {/* Member Info */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-medium text-slate-12 group-hover:text-slate-11 transition-colors">
                  {member.name}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.achievements.map((achievement, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-12 text-slate-1 text-xs rounded-full font-medium">
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-slate-12/5 to-transparent rounded-3xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
