import { computed, ref } from 'vue';
import { adjustVinStock, getVinByIdRaw, type Vin } from './vinService';
import { MouvementRecord, MouvementCreateInput, MouvementUpdateInput } from 'src/shared/mouvement';

export type MouvementType = 'ENTREE' | 'SORTIE';

export interface Mouvement {
  id: number;
  vinId: number;
  type: MouvementType;
  quantite: number;
  date: string;
  commentaire?: string;
  vinName?: string;
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
    commentaire: 'Degustation clients',
  },
]);

let nextMouvementId = mouvements.value.length + 1;
let hasSyncedWithElectron = false;

function mapRecordToMouvement(record: MouvementRecord): Mouvement {
  return {
    id: record.id,
    vinId: record.vinId,
    type: record.type,
    quantite: record.quantite,
    date: record.date,
    commentaire: record.commentaire ?? undefined,
    vinName: record.vinNom ?? undefined,
  };
}

async function hydrateFromElectron() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService?.mouvements) {
    return;
  }

  try {
    const remote = await window.electronService.mouvements.getMouvements();
    mouvements.value = remote.map(mapRecordToMouvement);
    nextMouvementId = mouvements.value.length
      ? Math.max(...mouvements.value.map((m) => m.id)) + 1
      : 1;
    hasSyncedWithElectron = true;
  } catch (err) {
    console.error('fetchMouvements failed', err);
  }
}

async function addMouvement(payload: MouvementInput) {
  const vin = getVinByIdRaw(payload.vinId);
  if (!vin) {
    throw new Error("Vin introuvable - impossible d'enregistrer le mouvement.");
  }

  const delta = payload.type === 'ENTREE' ? payload.quantite : -payload.quantite;
  adjustVinStock(payload.vinId, delta);

  const mouvementToPersist: MouvementCreateInput = {
    vinId: payload.vinId,
    type: payload.type,
    quantite: payload.quantite,
    date: payload.date ?? new Date().toISOString(),
    commentaire: payload.commentaire?.trim() || null,
  };

  if (typeof window !== 'undefined' && window.electronService?.mouvements) {
    try {
      const created = await window.electronService.mouvements.addMouvement(mouvementToPersist);
      const mouvement = mapRecordToMouvement(created);
      mouvements.value = [mouvement, ...mouvements.value];
      return mouvement;
    } catch (err) {
      console.error('addMouvement failed', err);
    }
  }

  const mouvement: Mouvement = {
    id: nextMouvementId++,
    vinId: payload.vinId,
    type: payload.type,
    quantite: payload.quantite,
    date: mouvementToPersist.date,
    commentaire: mouvementToPersist.commentaire ?? undefined,
    vinName: vin.nom,
  };

  mouvements.value = [mouvement, ...mouvements.value];
  return mouvement;
}

async function updateMouvement(id: number, updates: Partial<MouvementInput>) {
  const index = mouvements.value.findIndex((mouvement) => mouvement.id === id);
  if (index === -1) return null;

  const current = mouvements.value[index];
  const nextVinId = updates.vinId ?? current.vinId;
  const nextType = updates.type ?? current.type;
  const nextQuantite = updates.quantite ?? current.quantite;
  const nextDate = updates.date ?? current.date;
  const nextCommentaire = updates.commentaire?.trim() || current.commentaire;

  const originalDelta = current.type === 'ENTREE' ? current.quantite : -current.quantite;
  const nextDelta = nextType === 'ENTREE' ? nextQuantite : -nextQuantite;

  if (typeof window !== 'undefined' && window.electronService?.mouvements) {
    try {
      const updatedRecord = await window.electronService.mouvements.updateMouvement(id, {
        vinId: nextVinId,
        type: nextType,
        quantite: nextQuantite,
        date: nextDate,
        commentaire: nextCommentaire ?? null,
      } as MouvementUpdateInput);
      const mapped = mapRecordToMouvement(updatedRecord);

      if (nextVinId === current.vinId) {
        const deltaDiff = nextDelta - originalDelta;
        if (deltaDiff !== 0) adjustVinStock(nextVinId, deltaDiff);
      } else {
        adjustVinStock(current.vinId, -originalDelta);
        adjustVinStock(nextVinId, nextDelta);
      }

      mouvements.value.splice(index, 1, mapped);
      return mapped;
    } catch (err) {
      console.error('updateMouvement failed', err);
    }
  }

  if (nextVinId === current.vinId) {
    const deltaDiff = nextDelta - originalDelta;
    if (deltaDiff !== 0) {
      adjustVinStock(nextVinId, deltaDiff);
    }
  } else {
    adjustVinStock(current.vinId, -originalDelta);
    adjustVinStock(nextVinId, nextDelta);
  }

  const updated: Mouvement = {
    ...current,
    vinId: nextVinId,
    type: nextType,
    quantite: nextQuantite,
    date: nextDate,
    commentaire: nextCommentaire || undefined,
    vinName: getVinByIdRaw(nextVinId)?.nom ?? current.vinName,
  };

  mouvements.value.splice(index, 1, updated);
  return updated;
}

async function deleteMouvement(id: number) {
  const index = mouvements.value.findIndex((mouvement) => mouvement.id === id);
  if (index === -1) return false;

  const mouvement = mouvements.value[index];
  const delta = mouvement.type === 'ENTREE' ? mouvement.quantite : -mouvement.quantite;

  if (typeof window !== 'undefined' && window.electronService?.mouvements) {
    try {
      await window.electronService.mouvements.deleteMouvement(id);
    } catch (err) {
      console.error('deleteMouvement failed', err);
    }
  }

  adjustVinStock(mouvement.vinId, -delta);
  mouvements.value.splice(index, 1);
  return true;
}

function removeMouvementsForVin(vinId: number) {
  mouvements.value = mouvements.value.filter((mouvement) => mouvement.vinId !== vinId);
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
    updateMouvement,
    deleteMouvement,
    removeMouvementsForVin,
    fetchMouvements: hydrateFromElectron,
  };
}
