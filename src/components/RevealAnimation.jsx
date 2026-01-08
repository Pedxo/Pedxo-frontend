import { motion, useInView, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '../utility/helper'
import { useWindowSize } from '../hooks/useWindowsize'

export const RevealAnimation = ({
  children,
  direction = 'up',
  className,
  delay = 0,
  duration = 0.6,
  once = true,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '0px 0px -50px 0px' })
  const { width } = useWindowSize()
  const isMobile = width < 768
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const hiddenStyles = {
    left: { x: isMobile ? -10 : -60, opacity: 0 },
    right: { x: isMobile ? 10 : 60, opacity: 0 },
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
  }[direction]

  return (
    <motion.div
      ref={ref}
      className={cn(
        'will-change-transform h-full',
        direction !== 'up' && direction !== 'down' && 'overflow-hidden',
        className
      )}
      initial={hiddenStyles}
      animate={controls}
      variants={{
        hidden: hiddenStyles,
        visible: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.25, 0, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
