export const mobileMenuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}

export const hamburgerVariants = {
  open: { rotate: 90 },
  closed: { rotate: 0 },
}
