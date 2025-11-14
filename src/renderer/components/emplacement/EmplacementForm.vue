<template>
  <form class="entity-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="entity-form__eyebrow">Géographie de cave</p>
        <h3>Nouvel emplacement</h3>
      </div>
      <button type="submit">Enregistrer</button>
    </header>

    <div class="entity-form__grid">
      <label>
        Nom *
        <input v-model="form.nom" type="text" required />
      </label>
      <label>
        Type
        <select v-model="form.type">
          <option value="Cave">Cave</option>
          <option value="Casier">Casier</option>
          <option value="Armoire">Armoire</option>
          <option value="Autre">Autre</option>
        </select>
      </label>
      <label>
        Capacité (bt.)
        <input v-model.number="form.capacite" type="number" min="0" />
      </label>
      <label>
        Température
        <input v-model="form.temperature" type="text" placeholder="12°C" />
      </label>
      <label>
        Humidité
        <input v-model="form.humidite" type="text" placeholder="70%" />
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
import { useEmplacementService } from '../../services/emplacementService';

const { addEmplacement } = useEmplacementService();

const form = reactive({
  nom: '',
  type: 'Cave',
  capacite: undefined as number | undefined,
  temperature: '',
  humidite: '',
  notes: '',
});

const handleSubmit = () => {
  addEmplacement({ ...form });
  Object.assign(form, {
    nom: '',
    type: 'Cave',
    capacite: undefined,
    temperature: '',
    humidite: '',
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
  background: rgba(248, 250, 252, 0.08);
  color: #f8fafc;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  cursor: pointer;
}

.entity-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
select,
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
