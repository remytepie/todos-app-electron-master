<template>
  <section class="mouvement-list">
    <header>
      <div>
        <p class="mouvement-list__eyebrow">Suivi des flux</p>
        <h2>{{ title }}</h2>
      </div>
      <p class="mouvement-list__caption">
        {{ rows.length }} mouvements enregistrés
      </p>
    </header>

    <table>
      <thead>
        <tr>
          <th>Vin</th>
          <th>Type</th>
          <th>Quantité</th>
          <th>Date</th>
          <th>Commentaire</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mouvement in rows" :key="mouvement.id">
          <td>{{ vinName(mouvement.vinId) }}</td>
          <td>
            <span :class="['badge', mouvement.type === 'ENTREE' ? 'badge--in' : 'badge--out']">
              {{ mouvement.type === 'ENTREE' ? 'Entrée' : 'Sortie' }}
            </span>
          </td>
          <td>{{ mouvement.quantite }}</td>
          <td>{{ formatDate(mouvement.date) }}</td>
          <td>{{ mouvement.commentaire ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useMouvementService } from '../../services/mouvementService';
import { getVinByIdRaw } from '../../services/vinService';

const props = defineProps<{
  vinId?: number;
  title?: string;
}>();

const { mouvements, mouvementTimeline } = useMouvementService();

const rows = computed(() => {
  if (props.vinId) {
    return mouvements.value.filter((mouvement) => mouvement.vinId === props.vinId);
  }

  return mouvementTimeline.value;
});

const title = computed(() =>
  props.title ? props.title : props.vinId ? 'Mouvements du vin' : 'Historique complet',
);

const vinName = (vinId: number) => getVinByIdRaw(vinId)?.nom ?? '—';
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value));
</script>

<style scoped>
.mouvement-list {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.mouvement-list__eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

.mouvement-list__caption {
  color: #94a3b8;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  color: #94a3b8;
  font-size: 0.85rem;
}

th,
td {
  text-align: left;
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.badge {
  padding: 0.15rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--in {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.badge--out {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}
</style>
