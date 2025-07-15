import { useQuery } from '@tanstack/react-query'
import { refreshToken } from '../services/refreshToken'

export function useIsLoggedIn() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (!storedUser) return false

        const currentTime = Date.now()
        const { refreshTokenExpiration, accessTokenExpiration } = storedUser

        if (currentTime > refreshTokenExpiration) {
          localStorage.removeItem('user')
          return false
        }

        if (currentTime > accessTokenExpiration) {
          try {
            const newTokens = await refreshToken()
            localStorage.setItem('user', JSON.stringify(newTokens))
            return true
          } catch (error) {
            localStorage.removeItem('user')
            return false
          }
        }

        return true
      } catch (error) {
        console.error('Authentication check failed:', error)
        return false
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}
