import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.response.use(
  (res) => {
    const payload = res.data
    if (payload && payload.success === false) {
      return Promise.reject(new Error(payload.message || 'Request failed'))
    }
    return payload
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default http
