<template>
  <div class="admin-page">
    <template v-if="isAdmin">
      <section>
        <header>
          <h2>Fournisseurs</h2>
          <p>Centralisez vos contacts d'approvisionnement.</p>
        </header>
        <div class="admin-page__grid admin-page__grid--fournisseurs">
          <FournisseurForm />
          <FournisseurList />
        </div>
      </section>

      <section>
        <header>
          <h2>Emplacements</h2>
          <p>Visualisez vos caves, casiers et armoires.</p>
        </header>
        <div class="admin-page__grid">
          <EmplacementForm />
          <EmplacementList />
        </div>
      </section>
    </template>
    <div v-else class="admin-page__restricted">
      Cette section est réservée aux administrateurs.
    </div>
  </div>
</template>

<script lang="ts" setup>
import FournisseurForm from '../components/fournisseurs/FournisseurForm.vue';
import FournisseurList from '../components/fournisseurs/FournisseurList.vue';
import EmplacementForm from '../components/emplacement/EmplacementForm.vue';
import EmplacementList from '../components/emplacement/EmplacementList.vue';
import { useAuth } from '../services/authService';

const { isAdmin } = useAuth();
</script>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header h2 {
  margin-bottom: 0.25rem;
}

header p {
  margin: 0;
  color: #94a3b8;
}

.admin-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.admin-page__grid--fournisseurs {
  grid-template-columns: 1fr;
}

.admin-page__restricted {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  color: #cbd5f5;
  background: rgba(148, 163, 184, 0.1);
}
</style>
