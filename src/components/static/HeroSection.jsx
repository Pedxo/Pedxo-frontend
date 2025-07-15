import { Navigation } from './Navigation'
import bgGradient from '../../assets/svg/gradientBg.svg'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'
import ReactPlayer from 'react-player'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const GradientTextHeading = () => (
  <RevealAnimation delay={0.2} duration={0.8} className='w-full md:w-[80%]'>
    <h1 className='text-5xl md:text-[68px] font-bold leading-[60px] md:leading-[75px] text-center'>
      <span className='bg-gradient-to-r from-gradientPrimary via-violet to-gradientPrimary bg-clip-text text-transparent'>
        Try Agent
      </span>
      <span className='text-gray-900'> + Human on your codebase</span>
    </h1>
  </RevealAnimation>
)

const Description = () => (
  <RevealAnimation delay={0.4} duration={0.8} className='w-full md:w-1/2'>
    <p className='text-center text-lg text-gray-600'>
      Add creative humans to support your code agent with edge cases and build
      better software.
    </p>
  </RevealAnimation>
)

const ActionButton = ({ children, variant = 'primary', ...props }) => {
  const navigate = useNavigate()
  const goToDashboard = () => navigate('/dashboard')
  return (
    <button
      onClick={goToDashboard}
      className={`px-6 py-3 rounded-full font-medium transition-all shadow-sm ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-gradientPrimary via-violet to-gradientPrimary text-white hover:opacity-90'
          : 'border border-gray-300 text-gray-800 hover:bg-gray-50 bg-[#FFFFFF]'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

const ActionButtons = () => (
  <RevealAnimation delay={0.6} className='flex items-center gap-3'>
    <ActionButton variant='primary'>Add Human</ActionButton>
    <ActionButton variant='secondary'>Get Started</ActionButton>
  </RevealAnimation>
)

const DemoContainer = () => {
  const [hasError, setHasError] = useState(false)
  const youtubeUrl =
    'https://youtu.be/WhLFwXSJo5I?si=5jQ8Y37YfdjBQnRy' // ↞ same link, just lower‑case “si”

  return (
    <RevealAnimation
      delay={0.8}
      direction='up'
      duration={1}
      className='w-full max-w-[990px] p-4 md:p-8 bg-lightPrimary rounded-[14.14px]'
    >
      {/* Keep the player in a proportion‑box so it scales nicely */}
      <div className='relative w-full aspect-video rounded-lg overflow-hidden bg-white'>
        {hasError ? (
          <div className='flex h-full w-full items-center justify-center bg-gray-100'>
            <p className='text-gray-500'>Video could not be loaded</p>
          </div>
        ) : (
          <ReactPlayer
            src={youtubeUrl}              /* ✅ correct prop */
            width='100%'
            height='100%'
            controls
            playing
            muted
            loop
            className='absolute top-0 left-0' /* fills the wrapper */
            onError={() => setHasError(true)}
            config={{
              youtube: { playerVars: { modestbranding: 1 } },
              /* extra options, if you need them */
              file: {
                attributes: {
                  controlsList: 'nodownload',
                  disablePictureInPicture: true,
                },
              },
            }}
          />
        )}
      </div>
    </RevealAnimation>
  )
}

export const HeroSection = () => {
  return (
    <MaxScreenWrapper
      style={{
        backgroundImage: `url(${bgGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className=' rounded-none md:rounded-3xl py-4 md:py-14 px-4 md:px-24 bg-white'
    >
      <Navigation />
      <div className='md:mt-24 mt-14 flex flex-col items-center gap-6 md:gap-8'>
        <GradientTextHeading />
        <Description />
        <ActionButtons />
        <DemoContainer />
      </div>
    </MaxScreenWrapper>
  )
}
