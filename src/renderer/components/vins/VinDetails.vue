<template>
  <section v-if="vin" class="vin-details">
    <header>
      <div>
        <p class="vin-details__eyebrow">{{ vin.type }} • {{ vin.millesime ?? 'N/A' }}</p>
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
            <dt>Producteur</dt>
            <dd>{{ producteurName }}</dd>
          </div>
          <div>
            <dt>Fournisseur</dt>
            <dd>{{ fournisseurName }}</dd>
          </div>
          <div>
            <dt>Emplacement</dt>
            <dd>{{ emplacementLabel }}</dd>
          </div>
          <div>
            <dt>Maturit�</dt>
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
            <dt>Prix moyen</dt>
            <dd>{{ vin.prixMoyen ? vin.prixMoyen + ' €' : '—' }}</dd>
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
        <p v-else class="vin-details__muted">Aucune note pour l’instant.</p>
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
import { useProducteurService } from '../../services/producteurService';
import { useEmplacementService } from '../../services/emplacementService';

const props = defineProps<{
  vin?: Vin;
}>();

const { fournisseurs } = useFournisseurService();
const { producteurs } = useProducteurService();
const { emplacements } = useEmplacementService();
const maturityStatus = computed<MaturityStatus>(() =>
  props.vin
    ? getMaturityStatus(props.vin)
    : {
        label: 'N/A',
        detail: '',
        level: 'upcoming',
      },
);

const fournisseurName = computed(() => {
  if (!props.vin?.fournisseurId) return '—';
  return fournisseurs.value.find((f) => f.id === props.vin?.fournisseurId)?.nom ?? '—';
});

const producteurName = computed(() => {
  if (!props.vin?.producteurId) return '—';
  return producteurs.value.find((p) => p.id === props.vin?.producteurId)?.nom ?? '—';
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

  if (base === 'N/A') {
    return props.vin.emplacementPrecision;
  }

  return `${base} · ${props.vin.emplacementPrecision}`;
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(value));
</script>

<style scoped>
.vin-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 1.5rem;
  background: #0f172a;
  border: 1px solid #1e293b;
}

header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.vin-details__eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #94a3b8;
  letter-spacing: 0.2em;
}

.vin-details__region {
  color: #a5b4fc;
}

.vin-details__stock {
  background: #1d283a;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  text-align: center;
}

.vin-details__stock span {
  font-size: 2.5rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.vin-details__layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.vin-details__panel {
  background: #020617;
  border-radius: 1.25rem;
  padding: 1.25rem;
  border: 1px solid #1e293b;
}

dl {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 0;
}

dt {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
}

dd {
  margin: 0.25rem 0 0;
  font-weight: 600;
}

.vin-details__maturity {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.vin-details__maturity small {
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 400;
}

.vin-details__maturity-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 999px;
  padding: 0.2rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.vin-details__maturity-pill--upcoming {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}

.vin-details__maturity-pill--optimal {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}

.vin-details__maturity-pill--late {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.vin-details__muted {
  color: #64748b;
}

.vin-details__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
}

.vin-details__tags li {
  background: rgba(129, 140, 248, 0.15);
  border: 1px solid rgba(129, 140, 248, 0.3);
  padding: 0.25rem 0.8rem;
  border-radius: 9999px;
}

.vin-details__placeholder {
  padding: 2rem;
  text-align: center;
  border-radius: 1rem;
  background: #0f172a;
  border: 1px dashed #1e293b;
}
</style>

