<template>
  <section v-if="vin" class="vin-details">
    <header>
      <div>
        <p class="vin-details__eyebrow">{{ vin.type }} · {{ vin.millesime ?? 'N/A' }}</p>
        <h1>{{ vin.nom }}</h1>
        <p class="vin-details__region">{{ regionHeaderLabel }}</p>
      </div>
      <div class="vin-details__stock">
        <span>{{ vin.stock }}</span>
        <small>Bouteilles</small>
      </div>
    </header>

    <div class="vin-details__layout">
      <article class="vin-details__panel">
        <h3>Informations générales</h3>
        <dl>
          <div>
            <dt>Fournisseur</dt>
            <dd>{{ fournisseurName }}</dd>
          </div>
          <div>
            <dt>Emplacement</dt>
            <dd>{{ emplacementLabel }}</dd>
          </div>
          <div>
            <dt>Maturité</dt>
            <dd class="vin-details__maturity">
              <span
                :class="[
                  'vin-details__maturity-pill',
                  `vin-details__maturity-pill--${maturityStatus.level}`,
                ]"
              >
                {{ maturityStatus.label }}
              </span>
              <small v-if="maturityStatus.detail">{{ maturityStatus.detail }}</small>
            </dd>
          </div>
          <div>
            <dt>Région</dt>
            <dd>{{ regionFieldLabel }}</dd>
          </div>
          <div>
            <dt>Pays</dt>
            <dd>{{ countryLabel }}</dd>
          </div>
          <div>
            <dt>Potentiel de garde</dt>
            <dd>{{ vin.potentielGarde ?? 'À définir' }}</dd>
          </div>
          <div>
            <dt>Dernière mise à jour</dt>
            <dd>{{ formatDate(vin.derniereMiseAJour) }}</dd>
          </div>
        </dl>
      </article>

      <article class="vin-details__panel">
        <h3>Notes & tags</h3>
        <p v-if="vin.notes">{{ vin.notes }}</p>
        <p v-else class="vin-details__muted">Aucune note pour l'instant.</p>
        <ul v-if="vin.tags.length" class="vin-details__tags">
          <li v-for="tag in vin.tags" :key="tag">{{ tag }}</li>
        </ul>
      </article>
    </div>
  </section>

  <section v-else class="vin-details__placeholder">
    <p>Vin introuvable.</p>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Vin } from '../../services/vinService';
import { getMaturityStatus, type MaturityStatus } from '../../services/vinService';
import { useFournisseurService } from '../../services/fournisseurService';
import { useEmplacementService } from '../../services/emplacementService';

const props = defineProps<{ vin?: Vin }>();

const { fournisseurs } = useFournisseurService();
const { emplacements } = useEmplacementService();

const maturityStatus = computed<MaturityStatus>(() =>
  props.vin
    ? getMaturityStatus(props.vin)
    : { label: 'N/A', detail: '', level: 'upcoming' },
);

const fournisseurName = computed(() => {
  if (!props.vin?.fournisseurId) return '-';
  return fournisseurs.value.find((f) => f.id === props.vin?.fournisseurId)?.nom ?? '-';
});

const regionHeaderLabel = computed(() => {
  if (!props.vin?.region && !props.vin?.pays) {
    return 'Région non renseignée';
  }

  if (props.vin?.region && props.vin?.pays) {
    return `${props.vin.region}, ${props.vin.pays}`;
  }

  return props.vin?.region ?? props.vin?.pays ?? 'Région non renseignée';
});

const regionFieldLabel = computed(() => props.vin?.region ?? 'N/A');
const countryLabel = computed(() => props.vin?.pays ?? 'N/A');

const emplacementLabel = computed(() => {
  const base = props.vin?.emplacementId
    ? emplacements.value.find((e) => e.id === props.vin?.emplacementId)?.nom ?? 'N/A'
    : 'N/A';

  if (!props.vin?.emplacementPrecision) {
    return base;
  }

  return `${base} (${props.vin.emplacementPrecision})`;
});

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))
    : 'N/A';
</script>

<style scoped>
.vin-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.vin-details__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  font-size: 0.85rem;
}

.vin-details__region {
  margin: 0.25rem 0 0;
  color: #94a3b8;
}

.vin-details__stock {
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.vin-details__stock span {
  font-size: 1.8rem;
  font-weight: 700;
}

.vin-details__stock small {
  color: #94a3b8;
}

.vin-details__layout {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.vin-details__panel {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  background: #0b1221;
}

dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin: 0;
}

dl div {
  display: grid;
  grid-template-columns: auto;
  gap: 0.25rem;
}

.dt,
dt {
  color: #94a3b8;
  font-size: 0.9rem;
}

.dd,
dd {
  margin: 0;
}

.vin-details__maturity {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.vin-details__maturity small {
  color: #94a3b8;
}

.vin-details__maturity-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}

.vin-details__maturity-pill--optimal {
  background: rgba(74, 222, 128, 0.15);
  color: #4ade80;
}

.vin-details__maturity-pill--upcoming {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.vin-details__maturity-pill--late {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.vin-details__muted {
  color: #94a3b8;
}

.vin-details__tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
}

.vin-details__tags li {
  background: rgba(148, 163, 184, 0.15);
  color: #cbd5f5;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.85rem;
}

.vin-details__placeholder {
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  color: #cbd5f5;
  background: #0b1221;
}
</style>
