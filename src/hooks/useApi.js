import {useAuth} from '../context/AuthContext'

const API_BASE_URL = ''

export const useApi = () => {
  const {token, logout} = useAuth()

  const request = async (endpoint, options = {}) => {
    const config = {
      ...options,
      headers: {
        Accept: 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    }

    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, config)

      let data = null
      try {
        data = await response.json()
      } catch (error) {
        console.warn('Response has no JSON body:', error)
      }

      if (response.status === 401) {
        console.warn('Token expired. Logging out...')
        logout()
        return null
      }

      if (!response.ok) {
        return data || {error: 'Request failed'}
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      return {error: 'Unexpected error occurred'}
    }
  }

  return {request}
}
