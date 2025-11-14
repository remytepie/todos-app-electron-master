<template>
  <div class="vin-page">
    <div v-if="isAdmin" class="vin-page__form">
      <VinForm />
    </div>
    <div v-else class="vin-page__notice">
      Mode lecture seule : passez en mode administrateur pour ajouter ou modifier des vins.
    </div>
    <VinList />
  </div>
</template>

<script lang="ts" setup>
import VinForm from '../components/vins/VinForm.vue';
import VinList from '../components/vins/VinList.vue';
import { useAuth } from '../services/authService';

const { isAdmin } = useAuth();
</script>

<style scoped>
.vin-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vin-page__notice {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(148, 163, 184, 0.1);
  color: #cbd5f5;
}
</style>
