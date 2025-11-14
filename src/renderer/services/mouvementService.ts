import { computed, ref } from 'vue';
import { adjustVinStock, getVinByIdRaw, type Vin } from './vinService';

export type MouvementType = 'ENTREE' | 'SORTIE';

export interface Mouvement {
  id: number;
  vinId: number;
  type: MouvementType;
  quantite: number;
  date: string;
  commentaire?: string;
}

export interface MouvementInput {
  vinId: number;
  type: MouvementType;
  quantite: number;
  date?: string;
  commentaire?: string;
}

const mouvements = ref<Mouvement[]>([
  {
    id: 1,
    vinId: 1,
    type: 'ENTREE',
    quantite: 6,
    date: new Date().toISOString(),
    commentaire: 'Allocation primeur',
  },
  {
    id: 2,
    vinId: 2,
    type: 'SORTIE',
    quantite: 2,
    date: new Date().toISOString(),
    commentaire: 'Dégustation clients',
  },
]);

let nextMouvementId = mouvements.value.length + 1;

function addMouvement(payload: MouvementInput) {
  const vin = getVinByIdRaw(payload.vinId);
  if (!vin) {
    throw new Error("Vin introuvable – impossible d'enregistrer le mouvement.");
  }

  const delta = payload.type === 'ENTREE' ? payload.quantite : -payload.quantite;
  adjustVinStock(payload.vinId, delta);

  const mouvement: Mouvement = {
    id: nextMouvementId++,
    vinId: payload.vinId,
    type: payload.type,
    quantite: payload.quantite,
    date: payload.date ?? new Date().toISOString(),
    commentaire: payload.commentaire?.trim() || undefined,
  };

  mouvements.value = [mouvement, ...mouvements.value];
  return mouvement;
}

export function useMouvementService() {
  const mouvementTimeline = computed(() =>
    [...mouvements.value].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );

  const mouvementsParVin = (vinId: number) =>
    computed(() => mouvements.value.filter((mouvement) => mouvement.vinId === vinId));

  const vinDictionary = computed<Record<number, Vin>>(() => {
    return mouvements.value.reduce((acc, mouvement) => {
      const vin = getVinByIdRaw(mouvement.vinId);
      if (vin) {
        acc[vin.id] = vin;
      }
      return acc;
    }, {} as Record<number, Vin>);
  });

  return {
    mouvements,
    mouvementTimeline,
    mouvementsParVin,
    vinDictionary,
    addMouvement,
  };
}
