import http from './http'

export function userStats(username) {
  return http.get(`/users/${username}/stats`)
}
