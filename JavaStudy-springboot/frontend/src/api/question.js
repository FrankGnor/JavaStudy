import http from './http'

export function listQuestions(topic, username) {
  return http.get('/questions', {
    params: { topic, username }
  })
}

export function submitChoiceExam(payload) {
  return http.post('/exams/choice/submit', payload)
}
