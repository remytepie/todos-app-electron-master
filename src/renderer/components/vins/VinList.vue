<template>
  <section class="vin-list">
    <header class="vin-list__header">
      <div>
        <h2>Mes vins</h2>
        <p class="vin-list__caption">
          {{ vins.length }} références • {{ totalBottles }} bouteilles en cave
        </p>
      </div>
      <div class="vin-list__filters">
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher (nom, région, fournisseur)"
        />
        <select v-model="typeFilter">
          <option value="">Tous les styles</option>
          <option v-for="type in vinTypes" :key="type" :value="type">
            {{ type }}
          </option>
        </select>
      </div>
    </header>

    <div v-if="!filteredVins.length" class="vin-list__empty">
      <p>Aucun vin ne correspond à vos filtres.</p>
      <small>Ajoutez une première bouteille via le formulaire ou modifiez vos critères.</small>
    </div>

    <div class="vin-list__grid">
      <VinCard v-for="vin in filteredVins" :key="vin.id" :vin="vin" @open="handleOpen" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import VinCard from './VinCard.vue';
import { useVinStore, type Vin, type VinType } from '../../services/vinService';

const router = useRouter();
const { vins, fetchVins, totalBottles } = useVinStore();

const search = ref('');
const typeFilter = ref<VinType | ''>('');

const vinTypes: VinType[] = ['Rouge', 'Blanc', 'Rosé', 'Effervescent', 'Liquoreux', 'Autre'];

onMounted(fetchVins);

const filteredVins = computed(() => {
  const normalizedSearch = search.value.trim().toLowerCase();

  return vins.value.filter((vin) => {
    const matchSearch =
      !normalizedSearch ||
      vin.nom.toLowerCase().includes(normalizedSearch) ||
      (vin.region?.toLowerCase().includes(normalizedSearch) ?? false) ||
      (vin.pays?.toLowerCase().includes(normalizedSearch) ?? false) ||
      (vin.notes?.toLowerCase().includes(normalizedSearch) ?? false);

    const matchType = !typeFilter.value || vin.type === typeFilter.value;

    return matchSearch && matchType;
  });
});

const handleOpen = (vin: Vin) => {
  router.push(`/vin/${vin.id}`);
};
</script>

<style scoped>
.vin-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vin-list__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
}

.vin-list__caption {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.vin-list__filters {
  display: flex;
  gap: 0.75rem;
}

.vin-list__filters input,
.vin-list__filters select {
  border-radius: 9999px;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  padding: 0.6rem 1rem;
  min-width: 220px;
}

.vin-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.vin-list__empty {
  text-align: center;
  border: 1px dashed #475569;
  padding: 2rem;
  border-radius: 1rem;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

