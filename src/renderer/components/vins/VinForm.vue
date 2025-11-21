<template>
  <form class="vin-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="vin-form__eyebrow">Nouvelle entrée</p>
        <h2>Ajouter un vin</h2>
      </div>
      <button type="submit">Enregistrer</button>
    </header>

    <div class="vin-form__grid">
      <label>
        Nom du vin *
        <input v-model="form.nom" type="text" placeholder="Château..." required />
      </label>

      <label>
        Millésime
        <input v-model.number="form.millesime" type="number" min="1900" max="2100" />
      </label>

      <label>
        Type
        <select v-model="form.type" required>
          <option v-for="type in vinTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </label>

      <label>
        Région
        <input v-model="form.region" type="text" placeholder="Bourgogne..." />
      </label>

      <label>
        Pays
        <input v-model="form.pays" type="text" placeholder="France..." />
      </label>

      <label>
        Stock
        <input v-model.number="form.stock" type="number" min="0" />
      </label>

      <label>
        Potentiel de garde
        <input v-model="form.potentielGarde" type="text" placeholder="2028-2035" />
      </label>

      <label>
        Prix moyen
        <input v-model.number="form.prixMoyen" type="number" min="0" step="1" />
      </label>

      <label>
        Fournisseur
        <select v-model.number="form.fournisseurId">
          <option :value="undefined">Non spécifié</option>
          <option v-for="f in fournisseurs" :key="f.id" :value="f.id">{{ f.nom }}</option>
        </select>
      </label>

      <label>
        Emplacement
        <select v-model.number="form.emplacementId">
          <option :value="undefined">Non spécifié</option>
          <option v-for="e in emplacements" :key="e.id" :value="e.id">{{ e.nom }}</option>
        </select>
      </label>

      <label>
        Emplacement précis
        <input
          v-model="form.emplacementPrecision"
          type="text"
          placeholder="Rangée A · Case 1"
        />
      </label>
    </div>

    <label>
      Notes
      <textarea v-model="form.notes" rows="3" placeholder="Commentaires de dégustation ou instructions"></textarea>
    </label>

    <label>
      Tags (séparés par des virgules)
      <input v-model="tagsInput" type="text" placeholder="Grand cru, À surveiller..." />
    </label>

    <p v-if="feedback" class="vin-form__feedback">{{ feedback }}</p>
  </form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useVinStore, type VinInput, type VinType } from '../../services/vinService';
import { useFournisseurService } from '../../services/fournisseurService';
import { useEmplacementService } from '../../services/emplacementService';

const { addVin } = useVinStore();
const { fournisseurs } = useFournisseurService();
const { emplacements } = useEmplacementService();

const vinTypes: VinType[] = ['Rouge', 'Blanc', 'Rosé', 'Effervescent', 'Liquoreux', 'Autre'];

const form = reactive<VinInput & { stock: number }>({
  nom: '',
  type: 'Rouge',
  millesime: new Date().getFullYear(),
  region: '',
  pays: '',
  fournisseurId: undefined,
  emplacementId: undefined,
  emplacementPrecision: '',
  notes: '',
  tags: [],
  stock: 6,
  prixMoyen: undefined,
  potentielGarde: '',
});

const tagsInput = ref('');
const feedback = ref('');

const handleSubmit = () => {
  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  addVin({
    ...form,
    tags,
    stock: form.stock,
  });

  feedback.value = 'Vin ajouté avec succès 🎉';

  Object.assign(form, {
    nom: '',
    millesime: new Date().getFullYear(),
    region: '',
    pays: '',
    notes: '',
    stock: 6,
    potentielGarde: '',
    fournisseurId: undefined,
    emplacementId: undefined,
    emplacementPrecision: '',
    prixMoyen: undefined,
    tags: [],
  });
  tagsInput.value = '';

  setTimeout(() => (feedback.value = ''), 2500);
};
</script>

<style scoped>
.vin-form {
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 1.5rem;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vin-form header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.vin-form__eyebrow {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.vin-form button {
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
  border-radius: 9999px;
  padding: 0.65rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
}

.vin-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #cbd5f5;
}

input,
select,
textarea {
  background: #020617;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

.vin-form__feedback {
  margin: 0;
  font-size: 0.9rem;
  color: #34d399;
}
</style>


