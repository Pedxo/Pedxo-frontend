import { useNavigate } from 'react-router-dom'
import Call from '../../assets/svg/Call.svg'
import Expert from '../../assets/svg/Expert.svg'
import HumanTask from '../../assets/svg/HumanTask.svg'
import { cn } from '../../utility/helper'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'
import { motion } from 'framer-motion'

const SectionHeader = ({
  title,
  description,
  width = '80%',
  position = 'left',
}) => (
  <RevealAnimation
    delay={0.2}
    duration={0.8}
    className={cn(
      `w-full flex flex-col gap-6 md:gap-8 md:w-${width} me-auto`,
      position === 'right' && 'ms-auto'
    )}
  >
    <motion.h2
      initial={{ opacity: 0, x: position === 'right' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'text-3xl md:text-[48px] font-bold md:leading-[60px] leading-[40px] md:text-start text-center',
        position === 'right' && 'md:text-end'
      )}
    >
      {title}
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={cn(
        'md:text-start text-center text-lg text-gray-600 md:my-2 my-0',
        position === 'right' && 'md:text-end'
      )}
    >
      {description}
    </motion.p>
  </RevealAnimation>
)

const ImageCard = ({ src, alt, rounded = '[24px]' }) => (
  <RevealAnimation delay={0.4} duration={0.8} className='flex-grow h-fit'>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <img
        src={src}
        className={`w-full h-full md:rounded-[${rounded}] rounded-[10px] object-contain`}
        alt={alt}
      />
    </motion.div>
  </RevealAnimation>
)

const InfoCard = ({ title, content, onTryNow }) => (
  <RevealAnimation delay={0.3} duration={0.8} className='w-full'>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className='mt-4 bg-[#181B20] flex flex-col gap-6 md:gap-8 items-center justify-center md:rounded-[24px] rounded-[20px] md:px-24 px-4 md:py-[6rem] py-8 md:min-h-[501px] min-h-[300px] relative overflow-hidden'
    >
      {/* Animated background with slant lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='absolute inset-0 z-0 overflow-hidden'
      >
        <div className='relative w-full h-full'>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: i % 2 === 0 ? '-100%' : '100%',
                rotate: '35deg',
              }}
              animate={{
                x: 0,
                rotate: '15deg',
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.8,
                ease: 'easeOut',
              }}
              className='absolute h-[200%] w-[20%] origin-bottom-left top-[-15rem]'
              style={{
                left: `${i * (100 / 6)}%`,
                backgroundColor: i % 2 === 0 ? '#22252A' : '#181B20',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='relative z-10'
      >
        <p className='text-white text-2xl md:text-[48px] md:font-700 font-bold leading-[100%] text-center'>
          {title}
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className='w-full md:w-[90%] relative z-10'
      >
        <p className='text-center md:text-[20px] text-sm md:leading-[30px] leading-[20px] font-[500] text-[#F6F6F9]'>
          {content}
        </p>
      </motion.div>
      <motion.button
        onClick={onTryNow}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className='relative z-10 w-[162px] h-[43px] bg-white text-center flex items-center justify-center border border-gray-300 py-2.5 px-5 text-base text-darkGrey font-medium h-[43.61px] rounded-full hover:bg-gray-50 transition-colors'
      >
        Try Now
      </motion.button>
    </motion.div>
  </RevealAnimation>
)

export const CallSection = () => {
  const navigate = useNavigate()

  const handleTryNow = () => {
    navigate('/dashboard')
  }

  return (
    <MaxScreenWrapper className='px-4 md:px-24 flex flex-col items-center gap-6 md:gap-10'>
      {/* First Header + Image */}
      <SectionHeader
        title='Call teleoperator humans to support your agents on edge cases.'
        description='Our automated deal-making tool ensures your virtual dev signs the NDA and get paid on time'
      />
      <ImageCard src={Call} alt='Call teleoperator illustration' />

      {/* Second Header + Image */}
      <SectionHeader
        title='Get expert human engineers to supervise code Agents'
        description='Hire a human operator for your cursor or windsurf agent'
        position='right'
      />
      <ImageCard src={Expert} alt='Expert engineers illustration' />

      {/* Third Header + Image */}
      <SectionHeader
        title='Call for Human tasks'
        description='Keep a human in the loop to review and debug the code your agent generated for more creative output'
      />
      <ImageCard src={HumanTask} alt='Human tasks illustration' />

      {/* Info Card */}
      <InfoCard
        title='Super intelligent hiring agent'
        content='Save the back-and-forth of interview processes when hiring, just create a contract and onboard the right virtual engineer in under 5 minutes.'
        onTryNow={handleTryNow}
      />
    </MaxScreenWrapper>
  )
}
