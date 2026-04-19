import { ref, computed } from 'vue'

interface AuthUser {
  id: number;
  name: string;
  email: string;
  image: string;
}

const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref<string | null>(localStorage.getItem('token') || null)
const refreshToken = ref<string | null>(localStorage.getItem('refreshToken') || null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 30 })
      })

      const data = await response.json()
      if (response.ok) {
        // Save both tokens
        token.value = data.accessToken
        refreshToken.value = data.refreshToken
        user.value = { 
          id: data.id, 
          name: `${data.firstName} ${data.lastName}`, 
          email: data.email, 
          image: data.image 
        }

        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('user', JSON.stringify(user.value))
        return { success: true }
      }
      throw new Error(data.message)
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // REFRESH LOGIC: Call this if a request fails with 401 (Unauthorized)
  const refreshSession = async () => {
    if (!refreshToken.value) return logout()
    
    try {
      const res = await fetch('https://dummyjson.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshToken.value })
      })
      const data = await res.json()
      if (res.ok) {
        token.value = data.accessToken
        localStorage.setItem('token', data.accessToken)
      }
    } catch (e) {
      logout()
    }
  }

  const logout = () => {
    token.value = null
    refreshToken.value = null
    user.value = null
    localStorage.clear()
  }

  return { user, isLoggedIn, login, logout, refreshSession, token }
}