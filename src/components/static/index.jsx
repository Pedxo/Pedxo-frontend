import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { CallSection } from './CallSection'
import { FooterSection } from './FooterSection'
import { GoogleAiStudioSection } from './GoogleAiStudioSection'
import { HeroSection } from './HeroSection'
import { HumanLoopSection } from './HumanLoopSection'
import { ProblemSection } from './ProblemSection'
import { ResultBasedSection } from './ResultbasedSection'
import SliderSection from './SliderSection'
import { ToolsSection } from './ToolsSection'

const StaticPageComponent = () => {
  return (
    <MaxScreenWrapper className='max-w-[1660px] flex flex-col md:gap-y-14 gap-y-8 manrope-font'>
      <div className='md:p-8 p-0 flex flex-col md:gap-y-14 gap-y-8'>
        <HeroSection />
        <SliderSection />
        <ProblemSection />
        <GoogleAiStudioSection />
        <ResultBasedSection />
        <HumanLoopSection />
        <ToolsSection />
        <CallSection />
      </div>
      <FooterSection />
    </MaxScreenWrapper>
  )
}

export default StaticPageComponent
