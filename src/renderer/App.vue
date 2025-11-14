<template>
  <div class="app-shell">
    <aside class="sidebar">
      <h1>Vinum</h1>
      <p class="sidebar__subtitle">Pilotage de cave</p>
      <div class="sidebar__role">
        <label for="role-select">Mode</label>
        <select id="role-select" v-model="roleSelection">
          <option value="user">Lecture seule</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <nav>
        <RouterLink to="/vins" exact-active-class="is-active">Vins</RouterLink>
        <RouterLink to="/mouvements" exact-active-class="is-active">Mouvements</RouterLink>
        <RouterLink
          to="/admin"
          exact-active-class="is-active"
          :class="{ 'is-disabled': !isAdmin }"
          @click="handleAdminClick"
        >
          Administration
        </RouterLink>
      </nav>
    </aside>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAuth, type UserRole } from './services/authService';

const { role, isAdmin, setRole } = useAuth();

const roleSelection = computed({
  get: () => role.value,
  set: (value: UserRole) => setRole(value),
});

const handleAdminClick = (event: MouseEvent) => {
  if (!isAdmin.value) {
    event.preventDefault();
  }
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: radial-gradient(circle at top, #0b1121, #020617);
  color: #e2e8f0;
}

.sidebar {
  padding: 2rem 1.5rem;
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
}

.sidebar h1 {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
}

.sidebar__subtitle {
  margin: 0;
  color: #94a3b8;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

nav a {
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  text-decoration: none;
  color: #cbd5f5;
  border: 1px solid transparent;
}

nav a.is-active {
  border-color: rgba(99, 102, 241, 0.4);
  background: rgba(99, 102, 241, 0.15);
  color: #e0e7ff;
}

.sidebar__role {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.sidebar__role select {
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
  background: #020617;
  color: #e2e8f0;
  padding: 0.4rem 0.65rem;
}

.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

main {
  padding: 2rem;
  overflow-y: auto;
}
</style>
