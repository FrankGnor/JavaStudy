<template>
  <section class="card">
    <h2>Exam Demo</h2>
    <div class="form-row" style="display:flex;gap:8px;">
      <input v-model="username" placeholder="username" />
      <input v-model.number="topic" placeholder="topic" type="number" />
      <button @click="load" style="max-width:180px;">Load Questions</button>
    </div>

    <div v-if="questions.length">
      <div v-for="(q, idx) in questions" :key="q.qNo || idx" class="form-row">
        <label>{{ idx + 1 }}. {{ q.qTitle || q.title }}</label>
        <input v-model="answers[q.qNo]" placeholder="answer" />
      </div>
      <button @click="submit">Submit</button>
    </div>

    <p class="status">{{ status }}</p>
    <pre>{{ resultText }}</pre>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { listQuestions, submitChoiceExam } from '../api/question'

const username = ref(localStorage.getItem('loginUser') || '')
const topic = ref(1)
const status = ref('')
const questions = ref([])
const resultText = ref('')
const answers = reactive({})

async function load() {
  try {
    const res = await listQuestions(topic.value, username.value)
    questions.value = res.data || []
    status.value = `loaded ${questions.value.length} questions`
  } catch (e) {
    status.value = e.message
  }
}

async function submit() {
  try {
    const payload = {
      username: username.value,
      topic: String(topic.value),
      timer: '120'
    }

    questions.value.forEach((q) => {
      if (q.qNo) {
        payload[`type${q.qNo}`] = String(q.qtype || 1)
        payload[`exam${q.qNo}`] = answers[q.qNo] || ''
      }
    })

    const res = await submitChoiceExam(payload)
    resultText.value = JSON.stringify(res.data, null, 2)
    status.value = 'submitted'
  } catch (e) {
    status.value = e.message
  }
}
</script>
