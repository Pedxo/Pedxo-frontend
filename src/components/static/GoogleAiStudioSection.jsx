import studioImage from '../../assets/svg/GoogleStudio.svg'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'
import { motion } from 'framer-motion'

const GradientBorder = ({ position = 'left' }) => (
  <div>
    <motion.div
      initial={{
        opacity: 0,
        background: 'linear-gradient(to top, #0000, #0000)',
      }}
      animate={{
        opacity: 1,
        background: 'linear-gradient(to top, var(--primary), #fff)',
      }}
      transition={{ duration: 1, delay: position === 'left' ? 0.2 : 0.4 }}
      className={`w-[14px] sm:w-[44px] md:h-[210px] h-[100px] ${
        position === 'left' ? 'mb-8 mt-auto' : 'mt-8 mb-auto'
      }`}
      style={{
        '--primary': '#4285F4',
      }}
    />
  </div>
)

const StudioImageContainer = () => (
  <RevealAnimation delay={0.3} duration={1} className='flex-grow'>
    <motion.div
      initial={{ backgroundColor: '#0000' }}
      animate={{ backgroundColor: '#f5f5f5' }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className='md:p-10 p-4 md:rounded-[40px] rounded-[20px] h-fit'
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        src={studioImage}
        className='w-full h-full md:rounded-[20px] rounded-[10px] object-contain'
        alt='Google AI Studio'
      />
    </motion.div>
  </RevealAnimation>
)

export const GoogleAiStudioSection = () => {
  return (
    <MaxScreenWrapper className='max-w-[1138px] w-full relative flex md:gap-6 gap-2 md:px-0 px-3 items-stretch'>
      {/* Left gradient (bottom aligned) */}
      <div className='flex flex-col justify-end'>
        <GradientBorder position='left' />
      </div>

      <StudioImageContainer />

      {/* Right gradient (top aligned) */}
      <div className='flex flex-col justify-start'>
        <GradientBorder position='right' />
      </div>
    </MaxScreenWrapper>
  )
}
