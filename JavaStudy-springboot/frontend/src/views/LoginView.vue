<template>
  <section class="card">
    <h2>Login</h2>
    <div class="form-row">
      <input v-model="form.username" placeholder="username" />
    </div>
    <div class="form-row">
      <input v-model="form.password" placeholder="password" type="password" />
    </div>
    <button @click="doLogin">Login</button>
    <p class="status">{{ status }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/auth'

const router = useRouter()
const status = ref('')
const form = reactive({ username: '', password: '' })

async function doLogin() {
  try {
    const res = await login(form)
    localStorage.setItem('loginUser', res.data.username)
    status.value = 'login success'
    router.push('/dashboard')
  } catch (e) {
    status.value = e.message
  }
}
</script>
