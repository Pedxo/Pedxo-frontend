import HumanLoopImage from '../../assets/svg/HumanLoop.svg'
import AutomatedOnboard from '../../assets/svg/AutomatedOnboard.svg'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'
import { motion } from 'framer-motion'

const SectionHeader = ({ title, description, width = '1/2' }) => (
  <RevealAnimation
    delay={0.2}
    duration={0.8}
    className='w-full flex flex-col items-center justify-center'
  >
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='text-white text-3xl md:text-[48px] font-bold leading-[40px] text-center '
    >
      {title}
    </motion.h2>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={`w-full md:w-${width} m-auto md:mt-6 mt-0`}
    >
      <p className='text-center text-lg text-gray-600'>{description}</p>
    </motion.div>
  </RevealAnimation>
)

const SidePanel = ({ position = 'left' }) => (
  <RevealAnimation
    direction={position === 'left' ? 'left' : 'right'}
    delay={0.4}
    duration={1}
    className={`w-[44px] md:w-[70px] md:h-[210px] h-[100px] bg-gray-800 ${
      position === 'left'
        ? 'md:rounded-l-[21.78px] rounded-l-[10px]'
        : 'md:rounded-r-[21.78px] rounded-r-[10px]'
    }`}
  ></RevealAnimation>
)

const ImageCard = ({ src, alt, rounded = '[20px]' }) => (
  <RevealAnimation delay={0.5} duration={0.8} className='flex-grow'>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className='md:p-10 p-4 md:rounded-[40px] rounded-[20px] h-fit bg-[#22252A]'
    >
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        src={src}
        className={`w-full h-full md:rounded-[${rounded}] rounded-[10px] object-contain`}
        alt={alt}
      />
    </motion.div>
  </RevealAnimation>
)

const FeatureCard = ({ title, description, image }) => (
  <RevealAnimation delay={0.6} duration={0.8} className='flex-grow'>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='md:p-8 p-4 md:rounded-[26px] rounded-[13px] h-fit bg-[#22252A]'
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='md:rounded-[40px] rounded-[20px] h-fit'
      >
        <img
          src={image}
          className='w-full h-full md:rounded-[20px] rounded-[10px] object-contain'
          alt={title}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='flex flex-col items-center mt-8 gap-2'
      >
        <h2 className='text-white text-3xl md:text-[38px] font-bold leading-[40px] md:leading-[60px] text-center'>
          {title}
        </h2>
        <p className='text-center text-lg text-gray-600'>{description}</p>
      </motion.div>
    </motion.div>
  </RevealAnimation>
)

const InfoCard = ({ title, content, id }) => (
  <RevealAnimation delay={0.3} duration={0.7} className='w-full'>
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col gap-6 md:gap-8 items-center justify-center md:rounded-[60px] rounded-[20px] md:px-24 px-4 md:py-[6rem] py-8 bg-[#22252A] md:min-h-[501px] min-h-[300px]'
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className='text-white text-2xl md:text-[48px] md:font-700 font-bold leading-[100%] text-center'
      >
        {title}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='w-full md:w-[85%]'
      >
        <p className='text-center md:text-[20px] text-sm md:leading-[30px] leading-[20px] font-[500] text-gray-600'>
          {content}
        </p>
      </motion.div>
    </motion.div>
  </RevealAnimation>
)

export const HumanLoopSection = () => {
  return (
    <MaxScreenWrapper className='bg-[#181B20] rounded-none md:rounded-3xl py-8 md:py-14 px-4 md:px-24 flex flex-col items-center gap-6 md:gap-10'>
      <SectionHeader
        title='Import Humans-in-the-loop'
        description='Humans + AI agents = Faster shipping, better software, tighter security, quality of code and accurate debugging.'
      />

      <MaxScreenWrapper className='max-w-[1151px] w-full relative flex items-center'>
        <SidePanel position='left' />
        <ImageCard
          src={HumanLoopImage}
          alt='Human-in-the-loop workflow illustration'
        />
        <SidePanel position='right' />
      </MaxScreenWrapper>

      <MaxScreenWrapper className='max-w-[774px] w-full relative flex items-center'>
        <FeatureCard
          image={AutomatedOnboard}
          title='Automated onboarding use case'
          description='Create a contract and under 5 mins the system will onboard someone.'
        />
      </MaxScreenWrapper>

      <MaxScreenWrapper className='flex flex-col max-w-[990px] gap-6 md:gap-10'>
        <SectionHeader
          title='Codegen tools'
          description='Works best for AI codegen and creative humans supporting the agent on super edge cases.'
          width='70%'
        />

        <InfoCard
          id='use-cases'
          title='How to use it'
          content='Request to onboard creative human: Start by signing up and create a contract to define the required developer role, pay and tech stack then submit it. The tool will automatically onboard a human to add to the desired AI workspace tool via IDE or version control.'
        />

        <InfoCard
          title='Creative team ready for edge-case tasks'
          content='Our database consists of AI-native, creative engineers you can automatically call on to handle any agent edge case tasks.'
        />

        <InfoCard
          title='Best For'
          content='Clients who use code or design gen tools to build software and need human creativity to create a better output.'
        />

        <InfoCard
          title='When use it'
          content='Clients use various code and design gen tools to build software e.g; copilot, cursor, stitch but these tools often generate some buggy output that needs human insight and creativity to fix. Pedxo lets clients onboard a human in the loop to support these LLMs in edge cases like this.'
        />
      </MaxScreenWrapper>
    </MaxScreenWrapper>
  )
}
