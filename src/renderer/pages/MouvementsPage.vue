<template>
  <div class="mouvements-page">
    <MouvementForm v-if="isAdmin" />
    <div v-else class="mouvements-page__notice">
      Mode lecture seule : seuls les administrateurs peuvent créer des mouvements.
    </div>
    <MouvementList title="Historique global" />
  </div>
</template>

<script lang="ts" setup>
import MouvementForm from '../components/mouvements/MouvementForm.vue';
import MouvementList from '../components/mouvements/MouvementList.vue';
import { useAuth } from '../services/authService';

const { isAdmin } = useAuth();
</script>

<style scoped>
.mouvements-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mouvements-page__notice {
  border: 1px dashed #475569;
  border-radius: 1rem;
  padding: 1rem;
  color: #cbd5f5;
  background: rgba(148, 163, 184, 0.1);
}
</style>
