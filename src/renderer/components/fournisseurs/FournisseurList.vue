<template>
  <section class="entity-list">
    <header>
      <div>
        <p class="entity-list__eyebrow">Réseau fournisseurs</p>
        <h3>Liste</h3>
      </div>
      <p>{{ fournisseurs.length }} partenaires</p>
    </header>

    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Contact</th>
          <th>Email</th>
          <th>Région</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="f in fournisseurs" :key="f.id">
          <td>{{ f.nom }}</td>
          <td>{{ f.contact ?? '—' }}</td>
          <td>{{ f.email ?? '—' }}</td>
          <td>{{ f.region ?? '—' }}</td>
          <td>{{ f.notes ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { useFournisseurService } from '../../services/fournisseurService';

const { fournisseurs } = useFournisseurService();
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
}

th,
td {
  padding: 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.9rem;
}

thead {
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
}
</style>
