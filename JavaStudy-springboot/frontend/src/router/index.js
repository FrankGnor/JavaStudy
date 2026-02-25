import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ExamView from '../views/ExamView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/dashboard', component: DashboardView },
  { path: '/exam', component: ExamView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
