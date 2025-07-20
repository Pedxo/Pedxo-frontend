export function useIsLoggedIn() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) return true
  return false
}
