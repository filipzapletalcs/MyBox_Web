'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/animations'
import { CarouselNavigation } from '@/components/ui'
import { TeamMemberCard } from './components/TeamMemberCard'

interface TeamMember {
  id: string
  name: string
  position: string
  email: string
  phone: string | null
  imageUrl: string
}

interface TeamSectionProps {
  members?: TeamMember[]
}

// Card width + gap for scroll calculation
const CARD_WIDTH = 280
const GAP = 24
const VISIBLE_CARDS_DESKTOP = 5
const VISIBLE_CARDS_TABLET = 3
const VISIBLE_CARDS_MOBILE = 1.5

export function TeamSection({ members = [] }: TeamSectionProps) {
  const t = useTranslations('contactPage')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(3)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  // Použít členy z props
  const teamMembers = members

  // Calculate total pages based on viewport
  useEffect(() => {
    const calculatePages = () => {
      if (typeof window === 'undefined') return
      const width = window.innerWidth
      let visibleCards = VISIBLE_CARDS_DESKTOP
      if (width < 768) visibleCards = VISIBLE_CARDS_MOBILE
      else if (width < 1024) visibleCards = VISIBLE_CARDS_TABLET

      const pages = Math.ceil(teamMembers.length / Math.floor(visibleCards))
      setTotalPages(pages)
    }

    calculatePages()
    window.addEventListener('resize', calculatePages)
    return () => window.removeEventListener('resize', calculatePages)
  }, [teamMembers.length])

  // Update scroll state
  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    setCanScrollPrev(scrollLeft > 10)
    setCanScrollNext(scrollLeft < maxScroll - 10)

    // Calculate current page
    const scrollPerPage = (CARD_WIDTH + GAP) * Math.floor(VISIBLE_CARDS_DESKTOP)
    const page = Math.round(scrollLeft / scrollPerPage)
    setCurrentPage(Math.min(page, totalPages - 1))
  }, [totalPages])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', updateScrollState)
    updateScrollState()

    return () => container.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  // Scroll handlers
  const scrollPrev = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = (CARD_WIDTH + GAP) * 3
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }, [])

  const scrollNext = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = (CARD_WIDTH + GAP) * 3
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }, [])

  return (
    <section className="relative py-20 md:py-28 bg-bg-primary overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-[5%] w-[400px] h-[400px] rounded-full bg-green-500/3 blur-[120px]"
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-[10%] w-[300px] h-[300px] rounded-full bg-green-500/5 blur-[100px]"
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Header - in container */}
      <div className="container-custom px-6 relative z-10">
        <FadeIn direction="up">
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary"
            style={{ marginTop: 0, marginBottom: '0.5rem' }}
          >
            {t('team.title')}
          </h2>
        </FadeIn>
        <FadeIn direction="up" delay={0.1}>
          <p
            className="text-lg text-text-secondary"
            style={{ marginBottom: 0 }}
          >
            {t('team.subtitle')}
          </p>
        </FadeIn>
      </div>

      {/* Carousel - starts in safe zone, overflows right */}
      <div className="relative" style={{ marginTop: '4rem' }}>
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollSnapType: 'x mandatory',
            paddingRight: '2rem',
          }}
        >
          {/* Invisible spacer to align first card with header */}
          <div
            className="flex-shrink-0 carousel-spacer"
            aria-hidden="true"
          />
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-shrink-0 scroll-snap-align-start"
              style={{ width: CARD_WIDTH }}
            >
              <TeamMemberCard member={member} />
            </motion.div>
          ))}

          {/* Spacer at end for padding */}
          <div className="flex-shrink-0 w-8" aria-hidden="true" />
        </div>

        {/* Navigation controls - below cards */}
        <FadeIn direction="up" delay={0.2}>
          <div className="flex justify-center mt-10">
            <CarouselNavigation
              total={totalPages}
              current={currentPage}
              onPrev={scrollPrev}
              onNext={scrollNext}
              disablePrev={!canScrollPrev}
              disableNext={!canScrollNext}
              size="md"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
