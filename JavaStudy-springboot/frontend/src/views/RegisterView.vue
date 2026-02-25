<template>
  <section class="card">
    <h2>Register</h2>
    <div class="form-row"><input v-model="form.username" placeholder="username" /></div>
    <div class="form-row"><input v-model="form.password" type="password" placeholder="password" /></div>
    <div class="form-row"><input v-model="form.mobile" placeholder="mobile" /></div>
    <div class="form-row" style="display:flex;gap:8px;">
      <input v-model="form.verifyCode" placeholder="sms code" />
      <button @click="sendCode" style="max-width:160px;">Send Code</button>
    </div>
    <div class="form-row" style="display:flex;gap:8px;">
      <input v-model="form.checkCode" placeholder="captcha" />
      <img :src="captcha" alt="captcha" style="height:42px;border:1px solid #ddd;border-radius:6px;cursor:pointer;" @click="refreshCaptcha" />
    </div>
    <button @click="submit">Register</button>
    <p class="status">{{ status }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { register, sendSmsCode, captchaUrl } from '../api/auth'

const status = ref('')
const form = reactive({ username: '', password: '', mobile: '', verifyCode: '', checkCode: '' })
const captcha = ref('')

function refreshCaptcha() {
  captcha.value = `${captchaUrl()}?t=${Date.now()}`
}

refreshCaptcha()

async function sendCode() {
  try {
    const res = await sendSmsCode(form.mobile)
    status.value = res.data.devCode ? `dev code: ${res.data.devCode}` : 'sms sent'
  } catch (e) {
    status.value = e.message
  }
}

async function submit() {
  try {
    await register(form)
    status.value = 'register success'
  } catch (e) {
    status.value = e.message
    refreshCaptcha()
  }
}
</script>
