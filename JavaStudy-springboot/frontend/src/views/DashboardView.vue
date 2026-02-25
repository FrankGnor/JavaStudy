<template>
  <section class="card">
    <h2>User Dashboard</h2>
    <div class="form-row" style="display:flex;gap:8px;">
      <input v-model="username" placeholder="username" />
      <button @click="load" style="max-width:180px;">Load Stats</button>
    </div>
    <pre>{{ statsText }}</pre>
    <p class="status">{{ status }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { userStats } from '../api/user'

const username = ref(localStorage.getItem('loginUser') || '')
const status = ref('')
const statsText = ref('')

async function load() {
  try {
    const res = await userStats(username.value)
    statsText.value = JSON.stringify(res.data, null, 2)
    status.value = 'loaded'
  } catch (e) {
    status.value = e.message
  }
}
</script>
