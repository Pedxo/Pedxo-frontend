import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import { companies } from '../../data'
import { useEffect, useRef } from 'react'
import { MaxScreenWrapper } from '../MaxScreenWrapper'

const CompanyLogo = ({ logo, alt }) => (
  <div className='flex items-center justify-center px-3 md:px-5'>
    <img
      src={logo}
      alt={alt}
      className='h-[60px] md:h-[100px] lg:h-[142px] object-contain max-w-full'
      loading='lazy'
    />
  </div>
)

const SliderSection = () => {
  const swiperRef = useRef(null)
  const duplicatedCompanies = [...companies, ...companies, ...companies]

  useEffect(() => {
    const swiper = swiperRef.current?.swiper
    if (swiper) {
      swiper.setTranslate(0)
      swiper.autoplay.start()

      const animate = () => {
        const current = swiper.getTranslate()
        const max = swiper.maxTranslate()
        if (current <= max + 200) {
          swiper.setTranslate(-200)
        }
        requestAnimationFrame(animate)
      }

      const raf = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(raf)
    }
  }, [])

  const swiperConfig = {
    modules: [Autoplay, FreeMode],
    freeMode: {
      enabled: true,
      momentum: false,
      sticky: false,
    },
    autoplay: {
      delay: 1,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    speed: 4000,
    grabCursor: true,
    slidesPerView: 'auto',
    spaceBetween: 24,
    loop: false,
    className: 'w-full !overflow-visible',
    breakpoints: {
      320: { spaceBetween: 16 },
      768: { spaceBetween: 24 },
    },
  }

  return (
    <MaxScreenWrapper className='max-w-[1034px] w-full overflow-hidden bg-[#F1F1F1] rounded-none md:rounded-[25.45px] py-3.5 px-4 md:py-10 md:px-24'>
      <Swiper ref={swiperRef} {...swiperConfig}>
        {duplicatedCompanies.map((company, index) => (
          <SwiperSlide key={`${company.id}-${index}`} className='!w-auto'>
            <CompanyLogo logo={company.logo} alt={company.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
    </MaxScreenWrapper>
  )
}

export default SliderSection
