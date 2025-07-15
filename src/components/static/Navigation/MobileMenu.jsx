import { motion } from 'framer-motion'
import { NavItems, AuthButtons } from './NavItems'
import { mobileMenuVariants } from './animations'

export const MobileMenu = ({ isOpen }) => {
  return (
    <motion.div
      initial='closed'
      animate={isOpen ? 'open' : 'closed'}
      variants={mobileMenuVariants}
      className={`absolute top-20 right-4 left-4 bg-white rounded-2xl shadow-lg p-4 z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className='flex flex-col gap-4 items-center'>
        <NavItems />
        <div className='w-full border-t border-gray-100 my-2'></div>
        <AuthButtons />
      </div>
    </motion.div>
  )
}
