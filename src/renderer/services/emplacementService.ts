import { ref } from 'vue';
import {
  EmplacementCreateInput,
  EmplacementRecord,
  EmplacementType,
} from 'src/shared/emplacement';

export interface Emplacement {
  id: number;
  nom: string;
  type: EmplacementType;
  capacite?: number;
  temperature?: string;
  humidite?: string;
  notes?: string;
}

export interface EmplacementInput {
  nom: string;
  type: Emplacement['type'];
  capacite?: number;
  temperature?: string;
  humidite?: string;
  notes?: string;
}

export type EmplacementUpdate = Partial<EmplacementInput>;

const emplacements = ref<Emplacement[]>([]);
let nextEmplacementId = 1;
let hasSyncedWithElectron = false;

function mapRecordToEmplacement(record: EmplacementRecord): Emplacement {
  return {
    id: record.id,
    nom: record.nom,
    type: record.type ?? 'Autre',
    capacite: record.capacite ?? undefined,
    temperature: record.temperature ?? undefined,
    humidite: record.humidite ?? undefined,
    notes: record.notes ?? undefined,
  };
}

async function hydrateFromElectron() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService?.emplacements) {
    return;
  }

  try {
    const remote = await window.electronService.emplacements.getEmplacements();
    emplacements.value = remote.map(mapRecordToEmplacement);
    nextEmplacementId = emplacements.value.length
      ? Math.max(...emplacements.value.map((e) => e.id)) + 1
      : 1;
    hasSyncedWithElectron = true;
  } catch (err) {
    console.error('fetchEmplacements failed', err);
  }
}

async function addEmplacement(payload: EmplacementInput) {
  const emplacementToPersist: EmplacementCreateInput = {
    nom: payload.nom.trim(),
    type: payload.type,
    capacite: payload.capacite ?? null,
    temperature: payload.temperature?.trim() || null,
    humidite: payload.humidite?.trim() || null,
    notes: payload.notes?.trim() || null,
  };

  if (typeof window !== 'undefined' && window.electronService?.emplacements) {
    try {
      const created = await window.electronService.emplacements.addEmplacement(emplacementToPersist);
      const emplacement = mapRecordToEmplacement(created);
      emplacements.value = [emplacement, ...emplacements.value];
      return emplacement;
    } catch (err) {
      console.error('addEmplacement failed', err);
    }
  }

  const fallback: Emplacement = {
    id: nextEmplacementId++,
    nom: emplacementToPersist.nom,
    type: emplacementToPersist.type,
    capacite: emplacementToPersist.capacite ?? undefined,
    temperature: emplacementToPersist.temperature ?? undefined,
    humidite: emplacementToPersist.humidite ?? undefined,
    notes: emplacementToPersist.notes ?? undefined,
  };
  emplacements.value = [fallback, ...emplacements.value];
  return fallback;
}

export function useEmplacementService() {
  hydrateFromElectron();

  return {
    emplacements,
    addEmplacement,
    fetchEmplacements: hydrateFromElectron,
  };
}
