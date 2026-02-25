import http from './http'

export function login(payload) {
  return http.post('/auth/login', payload)
}

export function register(payload) {
  return http.post('/auth/register', payload)
}

export function resetPassword(payload) {
  return http.post('/auth/reset-password', payload)
}

export function sendSmsCode(mobile) {
  return http.post('/auth/sms-code', { mobile })
}

export function logout() {
  return http.post('/auth/logout')
}

export function captchaUrl() {
  return 'http://localhost:8080/api/auth/captcha'
}
