import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'

const SectionHeading = ({ children }) => (
  <RevealAnimation delay={0.2} duration={0.8} className='w-full md:w-[80%]'>
    <h2 className='text-gray-900 text-3xl md:text-[48px] font-bold leading-[40px] md:leading-[60px] text-center'>
      {children}
    </h2>
  </RevealAnimation>
)

const SectionDescription = ({ children }) => (
  <RevealAnimation delay={0.4} duration={0.8} direction='up'>
    <p className='text-center text-lg text-gray-600'>{children}</p>
  </RevealAnimation>
)

export const ProblemSection = () => {
  return (
    <MaxScreenWrapper className='px-4 md:px-24'>
      <div className='flex flex-col items-center gap-6 md:gap-8'>
        <SectionHeading>
          Solve problems creatively with Engineers + LLMs
        </SectionHeading>
        <SectionDescription>
          Use teleoperator engineers to support your AI code tool for more
          creative work.
        </SectionDescription>
      </div>
    </MaxScreenWrapper>
  )
}
