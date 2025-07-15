import { socialLinks } from '../../data'
import { MaxScreenWrapper } from '../MaxScreenWrapper'
import { RevealAnimation } from '../RevealAnimation'

export const FooterSection = () => {
  return (
    <footer className='w-full bg-[#181B20] p-4 md:p-14'>
      <MaxScreenWrapper
        className='flex flex-col md:gap-8 gap-6 items-center justify-center rounded-t-lg p-2 md:rounded-t-[39.911px] md:p-8 relative overflow-hidden'
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.00) 100%)',
          boxShadow: '24.39px -25.499px 84.145px -55.432px #000',
          backdropFilter: 'blur(94.7325210571289px)',
          borderTop: '1.109px solid rgba(255, 255, 255, 0.20)',
          borderLeft: '1.109px solid rgba(255, 255, 255, 0.20)',
          borderRight: '1.109px solid rgba(255, 255, 255, 0.20)',
          borderBottom: 'none',
        }}
      >
        {/* Background gradient glow */}
        <div
          className='absolute hidden md:block w-[889.12px] h-[174.06px] left-1/2 -translate-x-1/2 top-[-76.5px]'
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            boxShadow: '443.452px 443.452px 443.452px',
            borderRadius: '9999px',
            filter: 'blur(221.726px)',
          }}
        />

        <div className='grid w-full grid-cols-5 gap-3 relative'>
          {socialLinks.map((social, index) => {
            const isFirstItem = index === 0
            const commonStyles = {
              borderRadius: '7.825px',
              backdropFilter: 'blur(55.718685150146484px)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255, 255, 255, 0.20)',
            }

            const firstItemStyles = {
              ...commonStyles,
              background: 'rgba(255, 255, 255, 0.01)',
              boxShadow: '14.345px -14.997px 49.491px -32.603px #000',
              outlineOffset: '-0.65px',
            }

            const otherItemsStyles = {
              ...commonStyles,
              fill: 'rgba(255, 255, 255, 0.01)',
              filter: 'drop-shadow(14.345px -14.997px 49.491px #000)',
            }

            return (
              <RevealAnimation
                key={social.url}
                direction='up'
                delay={index * 0.1}
                duration={0.6}
              >
                <a
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-full w-full items-center justify-center p-1 md:p-10'
                  style={isFirstItem ? firstItemStyles : otherItemsStyles}
                >
                  {/* Gradient backgrounds for specific items */}
                  {index === 0 && (
                    <>
                      <div
                        className='absolute w-[75.63px] h-[49.98px] left-[51.51px] top-[16.95px]'
                        style={{
                          background: '#D9D9D9',
                          boxShadow: '33.972px 33.972px 33.972px',
                          borderRadius: '9999px',
                          filter: 'blur(36.986px)',
                        }}
                      />
                    </>
                  )}

                  {social.icon}
                </a>
              </RevealAnimation>
            )
          })}
        </div>

        <p className='text-center md:text-[15.521px] text-[10.521px] text-[#FFFFFF99]'>
          © 2025 Pedxo. All rights reserved.
        </p>
      </MaxScreenWrapper>
    </footer>
  )
}
