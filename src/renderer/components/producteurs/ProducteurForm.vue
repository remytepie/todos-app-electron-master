<template>
  <form class="entity-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="entity-form__eyebrow">Producteurs partenaires</p>
        <h3>Ajouter un producteur</h3>
      </div>
      <button type="submit">Créer</button>
    </header>

    <div class="entity-form__grid">
      <label>
        Nom *
        <input v-model="form.nom" type="text" required />
      </label>
      <label>
        Domaine
        <input v-model="form.domaine" type="text" />
      </label>
      <label>
        Région
        <input v-model="form.region" type="text" />
      </label>
      <label>
        Certification
        <input v-model="form.certification" type="text" />
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
import { useProducteurService } from '../../services/producteurService';

const { addProducteur } = useProducteurService();

const form = reactive({
  nom: '',
  domaine: '',
  region: '',
  certification: '',
  notes: '',
});

const handleSubmit = () => {
  addProducteur({ ...form });
  Object.assign(form, {
    nom: '',
    domaine: '',
    region: '',
    certification: '',
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
  background: rgba(16, 185, 129, 0.2);
  color: #a7f3d0;
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
