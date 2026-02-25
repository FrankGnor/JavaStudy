<template>
  <div class="app-shell">
    <header class="topbar">
      <h1>JavaStudy Interview Edition</h1>
      <nav>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/exam">Exam</RouterLink>
      </nav>
    </header>
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<style>
:root {
  --bg: #f4f7f9;
  --card: #ffffff;
  --ink: #0f172a;
  --accent: #0f766e;
  --muted: #64748b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", "PingFang SC", sans-serif;
  background: radial-gradient(circle at 15% 20%, #d9f3ee, transparent 40%), var(--bg);
  color: var(--ink);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--card);
  border-bottom: 1px solid #e2e8f0;
}

.topbar h1 {
  margin: 0;
  font-size: 20px;
}

.topbar nav {
  display: flex;
  gap: 16px;
}

.topbar a {
  text-decoration: none;
  color: var(--muted);
}

.topbar a.router-link-active {
  color: var(--accent);
  font-weight: 600;
}

.page {
  max-width: 980px;
  margin: 24px auto;
  padding: 0 16px;
}

.card {
  background: var(--card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.form-row {
  margin-bottom: 12px;
}

input,
button,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

button {
  border: 0;
  background: var(--accent);
  color: white;
  cursor: pointer;
}

.status {
  margin-top: 10px;
  color: var(--muted);
}
</style>
