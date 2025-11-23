import { ref } from 'vue';
import { FournisseurCreateInput, FournisseurRecord } from 'src/shared/fournisseur';

export interface Fournisseur {
  id: number;
  nom: string;
  contact?: string;
  region?: string;
  notes?: string;
}

export interface FournisseurInput {
  nom: string;
  contact?: string;
  region?: string;
  notes?: string;
}

export type FournisseurUpdate = Partial<FournisseurInput>;

const seedFournisseurs: Fournisseur[] = [
  {
    id: 1,
    nom: 'Maison Duplantier',
    contact: 'Marc Duplantier',
    region: 'Nouvelle-Aquitaine',
    notes: 'Specialiste des crus bordelais.',
  },
  {
    id: 2,
    nom: 'Clair & Fils',
    contact: 'Emma Clair',
    region: 'Bourgogne',
    notes: 'Fournisseur historique pour les blancs de Bourgogne.',
  },
];

const fournisseurs = ref<Fournisseur[]>([...seedFournisseurs]);
let nextFournisseurId = fournisseurs.value.length + 1;
let hasSyncedWithElectron = false;

function mapRecordToFournisseur(record: FournisseurRecord): Fournisseur {
  const contact = record.contact ?? undefined;

  return {
    id: record.id,
    nom: record.nom,
    contact,
    region: record.ville ?? undefined,
    notes: record.notes ?? undefined,
  };
}

async function hydrateFromElectron() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService?.fournisseurs) {
    return;
  }

  try {
    const remoteFournisseurs = await window.electronService.fournisseurs.getFournisseurs();
    fournisseurs.value = remoteFournisseurs.map(mapRecordToFournisseur);
    nextFournisseurId = fournisseurs.value.length
      ? Math.max(...fournisseurs.value.map((f) => f.id)) + 1
      : 1;
    hasSyncedWithElectron = true;
  } catch (err) {
    console.error('fetchFournisseurs failed', err);
  }
}

async function addFournisseur(payload: FournisseurInput) {
  const fournisseurToPersist: FournisseurCreateInput = {
    nom: payload.nom.trim(),
    ville: payload.region?.trim() || null,
    contact: payload.contact?.trim() || null,
    notes: payload.notes?.trim() || null,
  };

  if (typeof window !== 'undefined' && window.electronService?.fournisseurs) {
    try {
      const created = await window.electronService.fournisseurs.addFournisseur(fournisseurToPersist);
      const fournisseur = mapRecordToFournisseur(created);
      fournisseurs.value = [fournisseur, ...fournisseurs.value];
      return fournisseur;
    } catch (err) {
      console.error('addFournisseur failed', err);
    }
  }

  const contact = fournisseurToPersist.contact ?? undefined;
  const fallback: Fournisseur = {
    id: nextFournisseurId++,
    nom: fournisseurToPersist.nom,
    contact,
    region: fournisseurToPersist.ville ?? undefined,
    notes: fournisseurToPersist.notes ?? undefined,
  };
  fournisseurs.value = [fallback, ...fournisseurs.value];
  return fallback;
}

async function updateFournisseur(id: number, updates: FournisseurUpdate) {
  const index = fournisseurs.value.findIndex((f) => f.id === id);
  if (index === -1) return null;

  const current = fournisseurs.value[index];
  const nextNom = updates.nom?.trim() || current.nom;
  const nextContact = updates.contact?.trim() || current.contact;
  const nextRegion = updates.region?.trim() || current.region;
  const nextNotes = updates.notes?.trim() || current.notes;

  if (typeof window !== 'undefined' && window.electronService?.fournisseurs) {
    try {
      const updated = await window.electronService.fournisseurs.updateFournisseur(id, {
        nom: nextNom,
        ville: nextRegion || null,
        contact: nextContact || null,
        notes: nextNotes || null,
      });
      const mapped = mapRecordToFournisseur(updated);
      fournisseurs.value.splice(index, 1, mapped);
      return mapped;
    } catch (err) {
      console.error('updateFournisseur failed', err);
    }
  }

  const mapped: Fournisseur = {
    ...current,
    nom: nextNom,
    contact: nextContact || undefined,
    region: nextRegion || undefined,
    notes: nextNotes || undefined,
  };
  fournisseurs.value.splice(index, 1, mapped);
  return mapped;
}

async function deleteFournisseur(id: number) {
  const index = fournisseurs.value.findIndex((f) => f.id === id);
  if (index === -1) return false;

  if (typeof window !== 'undefined' && window.electronService?.fournisseurs) {
    try {
      await window.electronService.fournisseurs.deleteFournisseur(id);
    } catch (err) {
      console.error('deleteFournisseur failed', err);
    }
  }

  fournisseurs.value.splice(index, 1);
  return true;
}

export function useFournisseurService() {
  hydrateFromElectron();

  return {
    fournisseurs,
    fetchFournisseurs: hydrateFromElectron,
    addFournisseur,
    updateFournisseur,
    deleteFournisseur,
  };
}
