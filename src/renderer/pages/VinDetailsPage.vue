<template>
  <div class="vin-details-page">
    <VinDetails :vin="vin" />

    <div class="vin-details-page__grid" v-if="vin">
      <MouvementForm v-if="isAdmin" :vin-id="vin.id" />
      <div v-else class="vin-details-page__notice">
        Mode lecture seule : seuls les administrateurs peuvent enregistrer des mouvements.
      </div>
      <MouvementList :vin-id="vin.id" title="Historique du vin" />
    </div>

    <div v-else class="vin-details-page__empty">
      <p>Impossible de charger ce vin.</p>
      <RouterLink to="/">Retour à la liste</RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import VinDetails from '../components/vins/VinDetails.vue';
import MouvementForm from '../components/mouvements/MouvementForm.vue';
import MouvementList from '../components/mouvements/MouvementList.vue';
import { useVinStore } from '../services/vinService';
import { useAuth } from '../services/authService';

const route = useRoute();
const { vins, fetchVins } = useVinStore();

const vinId = computed(() => Number(route.params.id));
const vin = computed(() => vins.value.find((value) => value.id === vinId.value));
const { isAdmin } = useAuth();

onMounted(fetchVins);
</script>

<style scoped>
.vin-details-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vin-details-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.vin-details-page__notice {
  border: 1px dashed #475569;
  border-radius: 1rem;
  padding: 1rem;
  color: #cbd5f5;
  background: rgba(148, 163, 184, 0.1);
}

.vin-details-page__empty {
  text-align: center;
  padding: 2rem;
  border: 1px dashed #475569;
  border-radius: 1rem;
}
</style>
