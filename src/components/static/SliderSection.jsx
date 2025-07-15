import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { companies } from '../../data'
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
  const slides = [...companies, ...companies]

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    variableWidth: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 5000,
    cssEase: 'linear',
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 768, settings: { speed: 3500, pauseOnHover: false } },
    ],
  }

  return (
    <MaxScreenWrapper className='max-w-[1034px] w-full overflow-hidden rounded-none md:rounded-[25.45px] bg-[#F1F1F1] py-3.5 px-4 md:py-10 md:px-24'>
      <Slider {...settings} className='!overflow-visible'>
        {slides.map((c, i) => (
          <div key={`${c.id}-${i}`} className='!w-auto'>
            <CompanyLogo logo={c.logo} alt={c.alt} />
          </div>
        ))}
      </Slider>
    </MaxScreenWrapper>
  )
}

export default SliderSection
