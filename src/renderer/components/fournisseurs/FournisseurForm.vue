<template>
  <form class="entity-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="entity-form__eyebrow">Annuaire fournisseurs</p>
        <h3>Ajouter un fournisseur</h3>
      </div>
      <button type="submit">Ajouter</button>
    </header>

    <div class="entity-form__grid">
      <label>
        Nom *
        <input v-model="form.nom" type="text" required />
      </label>
      <label>
        Contact
        <input v-model="form.contact" type="text" />
      </label>
      <label>
        Email
        <input v-model="form.email" type="email" />
      </label>
      <label>
        Région
        <input v-model="form.region" type="text" />
      </label>
    </div>

    <label>
      Notes
      <textarea v-model="form.notes" rows="2"></textarea>
    </label>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useFournisseurService } from '../../services/fournisseurService';

const { addFournisseur } = useFournisseurService();

const form = reactive({
  nom: '',
  contact: '',
  email: '',
  region: '',
  notes: '',
});

const handleSubmit = () => {
  addFournisseur({ ...form });
  Object.assign(form, {
    nom: '',
    contact: '',
    email: '',
    region: '',
    notes: '',
  });
};
</script>

<style scoped>
.entity-form {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.entity-form__eyebrow {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

button {
  border: none;
  background: rgba(59, 130, 246, 0.2);
  color: #bfdbfe;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  cursor: pointer;
}

.entity-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: #cbd5f5;
  font-size: 0.9rem;
}

input,
textarea {
  border-radius: 0.75rem;
  border: 1px solid #1e293b;
  background: #020617;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
}

textarea {
  resize: vertical;
}
</style>
