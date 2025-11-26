import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useIsLoggedIn } from '../../../hooks/useIsLoggedIn'

export const NavItems = () => (
  <>
    <Link
      to='/dashboard'
      className='text-sm font-medium text-darkGrey hover:text-gradientPrimary transition-colors'
    >
      Try it now
    </Link>
    <Link
      to='#use-cases'
      onClick={() => {
        const element = document.getElementById('use-cases')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className='text-sm font-medium text-darkGrey hover:text-gradientPrimary transition-colors'
    >
      Use Cases
    </Link>
     <Link
      to='#price'
      onClick={() => {
        const element = document.getElementById('price')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }}
      className='text-sm font-medium text-darkGrey hover:text-gradientPrimary transition-colors'
    >
      Pricing
    </Link>
  </>
)

export const AuthButtons = () => {
  const isLoggedIn = useIsLoggedIn()
  const navigate = useNavigate()

  const goToDashboard = () => navigate('/dashboard')
  const goToLogin = () => navigate('/login')
  const goToSignup = () => navigate('/signup')

  if (isLoggedIn) {
    return (
      <button onClick={goToDashboard} className={primaryButton}>
        Dashboard
      </button>
    )
  }

  return (
    <div className='flex gap-3'>
      <button onClick={goToLogin} className={secondaryButton}>
        Log in
      </button>
      <button onClick={goToSignup} className={primaryButton}>
        Sign up
      </button>
    </div>
  )
}

const baseButton = `
  flex items-center justify-center
  border border-gray-300
  py-2.5 px-5
  text-base font-medium
  h-[44px]
  rounded-full
  transition-all
  cursor-pointer
`

const primaryButton = `
  ${baseButton}
  text-white
  bg-[#387dcd] shadow-md border-none hover:opacity-90
`

const secondaryButton = `
  ${baseButton}
  text-darkGrey
  hover:bg-gray-50
`
