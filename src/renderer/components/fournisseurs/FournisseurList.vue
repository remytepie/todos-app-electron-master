<template>
  <section class="entity-list">
    <header>
      <div>
        <p class="entity-list__eyebrow">Reseau fournisseurs</p>
        <h3>Liste des partenaires</h3>
      </div>
      <p>{{ fournisseurs.length }} partenaires</p>
    </header>

    <table>
      <colgroup>
        <col class="col-nom" />
        <col class="col-contact" />
        <col class="col-ville" />
        <col class="col-notes" />
        <col class="col-actions" />
      </colgroup>
      <thead>
        <tr>
          <th class="align-left">Nom</th>
          <th class="align-center">Contact</th>
          <th class="align-center">Ville</th>
          <th class="align-left">Notes</th>
          <th class="actions-header align-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in fournisseurs" :key="f.id">
          <template v-if="editingId === f.id">
            <td class="align-left"><input v-model="editForm.nom" type="text" /></td>
            <td class="align-center"><input v-model="editForm.contact" type="text" /></td>
            <td class="align-center"><input v-model="editForm.region" type="text" /></td>
            <td class="align-left"><input v-model="editForm.notes" type="text" /></td>
            <td class="actions align-right">
              <button class="btn btn--primary" @click="saveEdit">Enregistrer</button>
              <button class="btn btn--ghost" @click="cancelEdit">Annuler</button>
            </td>
          </template>
          <template v-else>
            <td class="align-left">{{ f.nom }}</td>
            <td class="align-center">{{ f.contact ?? '-' }}</td>
            <td class="align-center">{{ f.region ?? '-' }}</td>
            <td class="truncate align-left">{{ f.notes ?? '-' }}</td>
            <td class="actions align-right">
              <button class="btn btn--ghost" @click="startEdit(f)">Modifier</button>
              <button class="btn btn--danger" @click="confirmDelete(f.id)">Supprimer</button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useFournisseurService } from '../../services/fournisseurService';

const { fournisseurs, fetchFournisseurs, updateFournisseur, deleteFournisseur } = useFournisseurService();

const editingId = ref<number | null>(null);
const editForm = reactive({
  nom: '',
  contact: '',
  region: '',
  notes: '',
});

const startEdit = (fournisseur: (typeof fournisseurs.value)[number]) => {
  editingId.value = fournisseur.id;
  Object.assign(editForm, {
    nom: fournisseur.nom,
    contact: fournisseur.contact ?? '',
    region: fournisseur.region ?? '',
    notes: fournisseur.notes ?? '',
  });
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async () => {
  if (!editingId.value) return;
  await updateFournisseur(editingId.value, { ...editForm });
  editingId.value = null;
};

const confirmDelete = (id: number) => {
  if (window.confirm('Supprimer ce fournisseur ?')) {
    deleteFournisseur(id);
    if (editingId.value === id) {
      editingId.value = null;
    }
  }
};

onMounted(fetchFournisseurs);
</script>

<style scoped>
.entity-list {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  background: #0b1221;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.entity-list__eyebrow {
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

th,
td {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.9rem;
  vertical-align: middle;
}

thead {
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
}

.col-nom {
  width: 24%;
}

.col-contact {
  width: 20%;
}

.col-ville {
  width: 16%;
}

.col-notes {
  width: 26%;
}

.col-actions {
  width: 14%;
}

.actions-header {
  text-align: right;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #1e293b;
  background: #020617;
  color: #e2e8f0;
  padding: 0.35rem 0.5rem;
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  white-space: nowrap;
}

.btn {
  border: 1px solid #1e293b;
  border-radius: 0.5rem;
  padding: 0.3rem 0.65rem;
  background: transparent;
  color: #e2e8f0;
  cursor: pointer;
  font-size: 0.85rem;
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

.truncate {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
