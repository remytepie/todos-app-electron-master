<template>
  <article class="vin-card">
    <header class="vin-card__header">
      <div>
        <p class="vin-card__type">{{ vin.type }} • {{ vin.millesime ?? 'N/A' }}</p>
        <h3>{{ vin.nom }}</h3>
        <p v-if="vin.region" class="vin-card__region">{{ vin.region }}</p>
      </div>
      <button class="vin-card__action" @click="$emit('open', vin)">Détails</button>
    </header>

    <p v-if="vin.notes" class="vin-card__notes">{{ vin.notes }}</p>

    <dl class="vin-card__stats">
      <div>
        <dt>Stock</dt>
        <dd :class="['vin-card__stock', stockStatus]">{{ vin.stock }} bt.</dd>
      </div>
      <div>
        <dt>Potentiel</dt>
        <dd>{{ vin.potentielGarde ?? 'À définir' }}</dd>
      </div>
      <div>
        <dt>Dernière mise à jour</dt>
        <dd>{{ formatDate(vin.derniereMiseAJour) }}</dd>
      </div>
    </dl>

    <ul v-if="vin.tags.length" class="vin-card__tags">
      <li v-for="tag in vin.tags" :key="tag">{{ tag }}</li>
    </ul>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Vin } from '../../services/vinService';

const props = defineProps<{
  vin: Vin;
}>();

defineEmits<{
  open: [vin: Vin];
}>();

const stockStatus = computed(() => {
  if (props.vin.stock === 0) return 'vin-card__stock--empty';
  if (props.vin.stock < 6) return 'vin-card__stock--low';
  return 'vin-card__stock--ok';
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
</script>

<style scoped>
.vin-card {
  border-radius: 1rem;
  border: 1px solid #1e293b;
  padding: 1.25rem;
  background: radial-gradient(circle at top, #1e293b, #0f172a);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 230px;
}

.vin-card__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.vin-card__type {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.vin-card__region {
  color: #a5b4fc;
  font-weight: 500;
}

h3 {
  margin: 0;
}

.vin-card__action {
  background: transparent;
  border: 1px solid #64748b;
  color: #e2e8f0;
  border-radius: 9999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.vin-card__action:hover {
  background: rgba(148, 163, 184, 0.15);
}

.vin-card__notes {
  color: #cbd5f5;
  margin: 0;
}

.vin-card__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.vin-card__stats dt {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vin-card__stats dd {
  margin: 0.1rem 0 0;
  font-weight: 600;
}

.vin-card__stock {
  font-weight: 700;
}

.vin-card__stock--empty {
  color: #f87171;
}

.vin-card__stock--low {
  color: #fbbf24;
}

.vin-card__stock--ok {
  color: #34d399;
}

.vin-card__tags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.vin-card__tags li {
  background: rgba(148, 163, 184, 0.2);
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
</style>
