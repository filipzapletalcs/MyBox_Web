'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, Mail } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  position: string
  email: string
  phone: string | null
  imageUrl: string
}

interface TeamMemberCardProps {
  member: TeamMember
}

// Generate initials from name
function getInitials(name: string): string {
  const parts = name
    .replace(/^(Ing\.|Mgr\.|MA\.|MBA)\s*/i, '') // Remove titles
    .split(' ')
    .filter((part) => part.length > 0)

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return parts[0]?.[0]?.toUpperCase() || '?'
}

// Generate consistent color from name
function getAvatarColor(name: string): string {
  const colors = [
    'from-emerald-500/20 to-emerald-600/30',
    'from-green-500/20 to-green-600/30',
    'from-teal-500/20 to-teal-600/30',
    'from-cyan-500/20 to-cyan-600/30',
    'from-sky-500/20 to-sky-600/30',
    'from-blue-500/20 to-blue-600/30',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const initials = getInitials(member.name)
  const avatarColor = getAvatarColor(member.name)
  const showPlaceholder = imageError || !member.imageUrl

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Card */}
      <div
        className="
          relative overflow-hidden rounded-2xl
          bg-bg-secondary border border-border-subtle
          transition-all duration-500
          group-hover:border-green-500/30 group-hover:shadow-[0_0_40px_rgba(74,222,128,0.1)]
        "
      >
        {/* Image / Placeholder */}
        <div className="relative aspect-[3/4] overflow-hidden">
          {showPlaceholder ? (
            // Placeholder with initials
            <div
              className={`
                absolute inset-0 bg-gradient-to-br ${avatarColor}
                flex items-center justify-center
              `}
            >
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px),
                                    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Initials */}
              <span className="relative text-5xl md:text-6xl font-bold text-white/60">
                {initials}
              </span>

              {/* Decorative circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10" />
            </div>
          ) : (
            // Actual image
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-secondary via-bg-secondary/80 to-transparent" />

          {/* Hover overlay with contact actions */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-3">
              {member.phone && (
                <motion.a
                  href={`tel:${member.phone.replace(/\s/g, '')}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                  transition={{ delay: 0.1 }}
                  className="
                    w-11 h-11 rounded-full bg-green-500/20 backdrop-blur-sm
                    border border-green-500/30 flex items-center justify-center
                    hover:bg-green-500/30 transition-colors
                  "
                >
                  <Phone className="w-5 h-5 text-green-400" />
                </motion.a>
              )}
              <motion.a
                href={`mailto:${member.email}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.15 }}
                className="
                  w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm
                  border border-white/20 flex items-center justify-center
                  hover:bg-white/20 transition-colors
                "
              >
                <Mail className="w-5 h-5 text-white" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="relative p-5 -mt-6">
          {/* Name */}
          <h4 className="font-semibold text-lg text-text-primary mb-1 truncate">
            {member.name}
          </h4>

          {/* Position */}
          <p className="text-sm text-green-400 mb-3">
            {member.position}
          </p>

          {/* Contact info (visible on mobile, hidden on hover desktop) */}
          <div className="space-y-1.5 text-sm text-text-muted">
            {member.phone && (
              <a
                href={`tel:${member.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="truncate">{member.phone}</span>
              </a>
            )}
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{member.email}</span>
            </a>
          </div>
        </div>

        {/* Gradient border effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(74,222,128,0.2) 0%, transparent 50%, rgba(74,222,128,0.1) 100%)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            padding: '1px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}
