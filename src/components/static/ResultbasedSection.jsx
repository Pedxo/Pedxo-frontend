import studioImage from '../../assets/svg/resultBased.svg'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'
import { motion } from 'framer-motion'

const SidePanel = ({ position = 'left' }) => (
  <RevealAnimation
    direction={position === 'left' ? 'left' : 'right'}
    delay={0.2}
    duration={1}
    className={`w-[44px] md:w-[70px] h-[270px] bg-[#206BDC29] ${
      position === 'left'
        ? 'md:rounded-l-[21.78px] rounded-l-[10px]'
        : 'md:rounded-r-[21.78px] rounded-r-[10px]'
    }`}
  ></RevealAnimation>
)

const ImageContainer = () => (
  <RevealAnimation delay={0.4} duration={0.8}>
    <motion.div
      initial={{ backgroundColor: '#00000000' }}
      animate={{ backgroundColor: '#000000' }}
      transition={{ duration: 0.6 }}
      className='bg-black flex items-center justify-center md:rounded-[16px] rounded-[8px] overflow-hidden'
    >
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        src={studioImage}
        className='h-[150px] md:h-[400px] object-contain'
        alt='Result-based payment illustration'
      />
    </motion.div>
  </RevealAnimation>
)

const ContentSection = () => (
  <RevealAnimation delay={0.6} duration={0.6} className='w-full'>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className='flex flex-col items-center mt-8 gap-2'
    >
      <h2 className='text-gray-900 text-3xl md:text-[38px] font-bold leading-[40px] md:leading-[60px] text-center'>
        Result-based payment
      </h2>
      <p className='text-center text-lg text-gray-600'>
        Pay the human for work done at a time period and keep track of each
        spend.
      </p>
    </motion.div>
  </RevealAnimation>
)

export const ResultBasedSection = () => {
  return (
    <MaxScreenWrapper className='max-w-[935px] md:px-0 px-3 w-full relative flex items-center'>
      <SidePanel position='left' />

      <RevealAnimation
        delay={0.3}
        duration={0.8}
        className='flex-grow'
        direction='up'
      >
        <motion.div
          initial={{ backgroundColor: '#00000000' }}
          animate={{ backgroundColor: '#f5f5f5' }}
          transition={{ duration: 0.6 }}
          className='md:p-8 p-4 md:rounded-[26px] rounded-[13px] h-fit'
        >
          <ImageContainer />
          <ContentSection />
        </motion.div>
      </RevealAnimation>

      <SidePanel position='right' />
    </MaxScreenWrapper>
  )
}
