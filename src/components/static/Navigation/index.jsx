import { useState } from 'react'
import { motion } from 'framer-motion'
import BrandImage from '../../../assets/svg/Brand.svg'
import { NavItems, AuthButtons } from './NavItems'
import { MobileMenu } from './MobileMenu'
import { hamburgerVariants } from './animations'
import { GiHamburgerMenu } from "react-icons/gi";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className='w-full'>
      {/* Mobile Layout (shows on small screens) */}
      <div className='md:hidden overview-expense-bg rounded-full p-3 flex justify-between items-center'>
        <img src={BrandImage} className='w-[107px] h-[33px]' alt='Brand Logo' />
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          variants={hamburgerVariants}
          animate={isMobileMenuOpen ? 'open' : 'closed'}
          className='p-2 focus:outline-none'
          aria-label='Toggle menu'
        >
          <GiHamburgerMenu size={24} />
        </motion.button>
      </div>

      {/* Desktop Layout (shows on medium screens and up) */}
      <div className='hidden md:flex overview-expense-bg rounded-full p-4'>
        <div className='flex-1 flex items-center'>
          <img
            src={BrandImage}
            className='w-[107px] h-[33px]'
            alt='Brand Logo'
          />
        </div>

        <div className='flex-1 flex justify-center items-center gap-6'>
          <NavItems />
        </div>

        <div className='flex-1 flex justify-end items-center gap-3'>
          <AuthButtons />
        </div>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} />
    </nav>
  )
}
