import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import {useNavigate} from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [expiredAt, setExpiredAt] = useState(
    localStorage.getItem('expires_at') !== 'null'
      ? localStorage.getItem('expires_at')
      : null,
  )
  const [userProfile, setUserProfile] = useState(null)
  const [isAuthLoaded, setIsAuthLoaded] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const isLoggingOutRef = useRef(false)

  const isTokenExpired = () => {
    if (!expiredAt || expiredAt === 'null') return false

    const formattedExpiredAt = expiredAt.replace(/\.\d{6}Z$/, 'Z')

    const tokenExpirationDate = new Date(formattedExpiredAt).getTime()
    const nowUtc = Date.now()

    return nowUtc >= tokenExpirationDate
  }

  useEffect(() => {
    if (!token) {
      setIsAuthLoaded(true)
      return
    }

    if (isTokenExpired()) {
      if (!isLoggingOutRef.current) {
        isLoggingOutRef.current = true
        setTimeout(() => clearSession(), 0)
      }
    } else {
      fetchUserProfile()
    }
  }, [])

  useEffect(() => {
    if (isLoggingOut) {
      setTimeout(() => clearSession(), 0)
    }
  }, [isLoggingOut])

  const fetchUserProfile = async () => {
    try {
      // console.log('🔄 Fetching user profile with token:', token)

      const response = await fetch(
        'https://dashboard.pitchcapital.com/api/user',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // console.log('📩 API Response Status:', response.status)

      if (response.ok) {
        const data = await response.json()
        // console.log('✅ User profile loaded:', data)

        setUserProfile(data)
        setUser({email: data?.user?.email})
        setIsAuthLoaded(true)
      } else {
        // console.warn('🚨 Unauthorized! Scheduling logout...')
        setIsLoggingOut(true)
      }
    } catch (error) {
      // console.error('⚠️ Error fetching user profile:', error)
      setIsLoggingOut(true)
    }
  }

  const login = async (email, password, rememberMe) => {
    try {
      const response = await fetch(
        'https://dashboard.pitchcapital.com/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({email, password, remember_me: rememberMe}),
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Invalid credentials')
      }

      const data = await response.json()
      // console.log('✅ Login successful:', data)

      setUser({email})
      setToken(data.access_token)
      setExpiredAt(data.expires_at || null)

      // console.log('DATA: ', data)

      localStorage.setItem('user', JSON.stringify({email}))
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('expires_at', data.expires_at || 'null')

      await fetchUserProfile()

      return true
    } catch (error) {
      // console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    setIsLoggingOut(true)
  }

  const clearSession = (redirect = true) => {
    // console.log('🧹 Clearing session...')
    setUser(null)
    setToken(null)
    setUserProfile(null)
    setExpiredAt(null)
    setIsAuthLoaded(true)

    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('expires_at')

    setTimeout(() => {
      if (redirect) {
        // console.warn('🔄 Redirecting to login page')
        navigate('/login', {replace: true})
      }
    }, 0)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        expiredAt,
        userProfile,
        isAuthLoaded,
        login,
        logout,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
