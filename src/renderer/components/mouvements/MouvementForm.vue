<template>
  <form class="mouvement-form" @submit.prevent="handleSubmit">
    <header>
      <div>
        <p class="mouvement-form__eyebrow">Flux de stock</p>
        <h2>Ajouter un mouvement</h2>
      </div>
      <button type="submit">Valider</button>
    </header>

    <div class="mouvement-form__grid">
      <label>
        Vin concerné *
        <select v-model.number="form.vinId" required>
          <option v-for="vin in vins" :key="vin.id" :value="vin.id">
            {{ vin.nom }} ({{ vin.stock }} bt.)
          </option>
        </select>
      </label>

      <p class="mouvement-form__label">Type</p>
      <div class="mouvement-form__pill-group">
        <button
          type="button"
          :class="['pill', form.type === 'ENTREE' && 'pill--active']"
          @click="form.type = 'ENTREE'"
        >
          Entrée
        </button>
        <button
          type="button"
          :class="['pill', form.type === 'SORTIE' && 'pill--active']"
          @click="form.type = 'SORTIE'"
        >
          Sortie
        </button>
      </div>

      <label>
        Quantité *
        <input v-model.number="form.quantite" type="number" min="1" required />
      </label>

      <label>
        Date
        <input v-model="form.date" type="date" required />
      </label>
    </div>

    <label>
      Commentaire
      <textarea
        v-model="form.commentaire"
        rows="2"
        placeholder="Précisions (commande, dégustation...)"
      ></textarea>
    </label>

    <p v-if="feedback" class="mouvement-form__feedback">{{ feedback }}</p>
  </form>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useMouvementService } from '../../services/mouvementService';
import { useVinStore } from '../../services/vinService';

const props = defineProps<{
  vinId?: number;
}>();

const { addMouvement } = useMouvementService();
const { vins, fetchVins } = useVinStore();

onMounted(fetchVins);

const today = new Date().toISOString().split('T')[0];

const form = reactive({
  vinId: props.vinId ?? (vins.value[0]?.id ?? 0),
  type: 'ENTREE',
  quantite: 1,
  date: today,
  commentaire: '',
});

watch(
  () => props.vinId,
  (value) => {
    if (value) {
      form.vinId = value;
    }
  },
);

const feedback = ref('');

const handleSubmit = () => {
  if (!form.vinId) return;

  addMouvement({
    vinId: form.vinId,
    type: form.type as 'ENTREE' | 'SORTIE',
    quantite: form.quantite,
    date: new Date(form.date).toISOString(),
    commentaire: form.commentaire,
  });

  feedback.value = 'Mouvement enregistré ✅';
  form.quantite = 1;
  form.commentaire = '';
  form.date = today;

  setTimeout(() => (feedback.value = ''), 2000);
};
</script>

<style scoped>
.mouvement-form {
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 1.5rem;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.mouvement-form__eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
}

button[type='submit'] {
  background: linear-gradient(120deg, #0ea5e9, #22d3ee);
  border: none;
  color: white;
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
}

.mouvement-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  align-items: center;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-weight: 600;
  color: #cbd5f5;
}

.mouvement-form__label {
  font-weight: 600;
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
}

.mouvement-form__pill-group {
  display: flex;
  gap: 0.5rem;
}

.pill {
  border-radius: 999px;
  border: 1px solid #1e293b;
  padding: 0.4rem 1rem;
  background: transparent;
  color: #e2e8f0;
  cursor: pointer;
}

.pill--active {
  background: rgba(45, 212, 191, 0.15);
  border-color: rgba(45, 212, 191, 0.5);
  color: #2dd4bf;
}

.mouvement-form__feedback {
  color: #34d399;
  margin: 0;
}
</style>
