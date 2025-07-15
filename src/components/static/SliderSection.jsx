import { useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

import { companies } from '../../data'
import { MaxScreenWrapper } from '../MaxScreenWrapper'

const CompanyLogo = ({ logo, alt }) => (
  <div className='flex items-center justify-center px-3 md:px-5'>
    <img
      src={logo}
      alt={alt}
      className='h-[60px] md:h-[100px] lg:h-[142px] max-w-full object-contain'
      loading='lazy'
    />
  </div>
)

const SliderSection = () => {
  const slides = useMemo(() => [...companies, ...companies], [])

  return (
    <MaxScreenWrapper className='max-w-[1034px] w-full overflow-hidden rounded-none md:rounded-[25.45px] bg-[#F1F1F1] py-3.5 px-4 md:py-10 md:px-24'>
      <Swiper
        modules={[Autoplay, FreeMode]}
        slidesPerView='auto'
        spaceBetween={24}
        freeMode={{ enabled: true, momentum: false, sticky: false }}
        loop
        speed={5000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        grabCursor
        className='w-full !overflow-visible'
        breakpoints={{
          320: { spaceBetween: 16, slidesPerView: 2.5 },
          768: { spaceBetween: 24 },
        }}
      >
        {slides.map((c, i) => (
          <SwiperSlide key={`${c.id}-${i}`} className='!w-auto'>
            <CompanyLogo logo={c.logo} alt={c.alt} />
          </SwiperSlide>
        ))}
      </Swiper>
    </MaxScreenWrapper>
  )
}

export default SliderSection
