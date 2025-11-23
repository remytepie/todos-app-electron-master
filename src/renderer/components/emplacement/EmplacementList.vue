<template>
  <section class="entity-list">
    <header>
      <div>
        <p class="entity-list__eyebrow">Implantations</p>
        <h3>Emplacements</h3>
      </div>
      <p>{{ emplacements.length }} zones</p>
    </header>

    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type</th>
          <th>Capacité</th>
          <th>Température</th>
          <th>Humidité</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emplacement in emplacements" :key="emplacement.id">
          <td>{{ emplacement.nom }}</td>
          <td>{{ emplacement.type }}</td>
          <td>{{ emplacement.capacite ?? '—' }}</td>
          <td>{{ emplacement.temperature ?? '—' }}</td>
          <td>{{ emplacement.humidite ?? '—' }}</td>
          <td>{{ emplacement.notes ?? '—' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts" setup>
import { useEmplacementService } from '../../services/emplacementService';

const { emplacements } = useEmplacementService();
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
