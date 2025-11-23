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
      <colgroup>
        <col class="col-vin" />
        <col class="col-type" />
        <col class="col-qty" />
        <col class="col-date" />
        <col class="col-comment" />
        <col class="col-actions" />
      </colgroup>
      <thead>
        <tr>
          <th class="align-left">Vin</th>
          <th class="align-center">Type</th>
          <th class="align-right">Quantité</th>
          <th class="align-center">Date</th>
          <th class="align-left">Commentaire</th>
          <th class="actions-header align-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mouvement in rows" :key="mouvement.id">
          <template v-if="editingId === mouvement.id">
            <td class="align-left">
              <select v-model.number="editForm.vinId">
                <option v-for="vin in vins" :key="vin.id" :value="vin.id">
                  {{ vin.nom }}
                </option>
              </select>
            </td>
            <td class="align-center">
              <select v-model="editForm.type">
                <option value="ENTREE">Entrée</option>
                <option value="SORTIE">Sortie</option>
              </select>
            </td>
            <td class="align-right">
              <input v-model.number="editForm.quantite" type="number" min="1" />
            </td>
            <td class="align-center">
              <input v-model="editForm.date" type="date" />
            </td>
            <td class="align-left">
              <input v-model="editForm.commentaire" type="text" />
            </td>
            <td class="actions align-right">
              <button class="btn btn--primary" @click="saveEdit">Enregistrer</button>
              <button class="btn btn--ghost" @click="cancelEdit">Annuler</button>
            </td>
          </template>
          <template v-else>
            <td class="align-left">{{ mouvement.vinName ?? vinName(mouvement.vinId) }}</td>
            <td class="align-center">
              <span :class="['badge', mouvement.type === 'ENTREE' ? 'badge--in' : 'badge--out']">
                {{ mouvement.type === 'ENTREE' ? 'Entrée' : 'Sortie' }}
              </span>
            </td>
            <td class="align-right">{{ mouvement.quantite }}</td>
            <td class="align-center">{{ formatDate(mouvement.date) }}</td>
            <td class="truncate align-left">{{ mouvement.commentaire ?? '-' }}</td>
            <td class="actions align-right">
              <button class="btn btn--ghost" @click="startEdit(mouvement)">Modifier</button>
              <button class="btn btn--danger" @click="confirmDelete(mouvement.id)">Supprimer</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useMouvementService } from '../../services/mouvementService';
import type { Mouvement } from '../../services/mouvementService';
import { getVinByIdRaw, useVinStore } from '../../services/vinService';

const props = defineProps<{
  vinId?: number;
  title?: string;
}>();

const { mouvements, mouvementTimeline, updateMouvement, deleteMouvement, fetchMouvements } =
  useMouvementService();
const { vins, fetchVins } = useVinStore();

onMounted(() => {
  fetchVins();
  fetchMouvements();
});

const rows = computed(() => {
  if (props.vinId) {
    return mouvements.value.filter((mouvement) => mouvement.vinId === props.vinId);
  }

  return mouvementTimeline.value;
});

const title = computed(() =>
  props.title ? props.title : props.vinId ? 'Mouvements du vin' : 'Historique complet',
);

const editingId = ref<number | null>(null);
const editForm = reactive({
  vinId: 0,
  type: 'ENTREE',
  quantite: 1,
  date: '',
  commentaire: '',
});

const startEdit = (mouvement: Mouvement) => {
  editingId.value = mouvement.id;
  Object.assign(editForm, {
    vinId: mouvement.vinId,
    type: mouvement.type,
    quantite: mouvement.quantite,
    date: mouvement.date.split('T')[0],
    commentaire: mouvement.commentaire ?? '',
  });
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = () => {
  if (!editingId.value) return;

  const isoDate = editForm.date ? new Date(editForm.date).toISOString() : new Date().toISOString();

  updateMouvement(editingId.value, {
    vinId: editForm.vinId,
    type: editForm.type as 'ENTREE' | 'SORTIE',
    quantite: editForm.quantite,
    date: isoDate,
    commentaire: editForm.commentaire,
  });

  editingId.value = null;
};

const confirmDelete = (id: number) => {
  if (window.confirm('Supprimer ce mouvement ?')) {
    deleteMouvement(id);
  }
};

const vinName = (vinId: number) => getVinByIdRaw(vinId)?.nom ?? '-';
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
  table-layout: fixed;
}

thead {
  color: #94a3b8;
  font-size: 0.85rem;
}

th,
td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  vertical-align: middle;
}

th {
  text-align: left;
}

td input,
td select {
  width: 100%;
  box-sizing: border-box;
}

.actions-header,
.actions {
  text-align: right;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.col-vin {
  width: 26%;
}

.col-type {
  width: 14%;
}

.col-qty {
  width: 10%;
}

.col-date {
  width: 16%;
}

.col-comment {
  width: 24%;
}

.col-actions {
  width: 10%;
}

.align-right {
  text-align: right;
}

.truncate {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  border: 1px solid #1e293b;
  border-radius: 0.5rem;
  padding: 0.35rem 0.75rem;
  background: transparent;
  color: #e2e8f0;
  cursor: pointer;
}

.btn--primary {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.btn--ghost {
  border-color: rgba(148, 163, 184, 0.4);
}

.btn--danger {
  background: rgba(248, 113, 113, 0.15);
  border-color: rgba(248, 113, 113, 0.4);
  color: #fca5a5;
}
</style>
