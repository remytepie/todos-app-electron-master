import { ref } from 'vue';

export interface Fournisseur {
  id: number;
  nom: string;
  contact?: string;
  email?: string;
  region?: string;
  notes?: string;
}

export interface FournisseurInput {
  nom: string;
  contact?: string;
  email?: string;
  region?: string;
  notes?: string;
}

const fournisseurs = ref<Fournisseur[]>([
  {
    id: 1,
    nom: 'Maison Duplantier',
    contact: 'Marc Duplantier',
    email: 'marc@duplantier.fr',
    region: 'Nouvelle-Aquitaine',
    notes: 'Spécialiste des crus bordelais.',
  },
  {
    id: 2,
    nom: 'Clair & Fils',
    contact: 'Emma Clair',
    email: 'emma@clairfils.fr',
    region: 'Bourgogne',
    notes: 'Fournisseur historique pour les blancs de Bourgogne.',
  },
]);

let nextFournisseurId = fournisseurs.value.length + 1;

function addFournisseur(payload: FournisseurInput) {
  const fournisseur: Fournisseur = {
    id: nextFournisseurId++,
    nom: payload.nom.trim(),
    contact: payload.contact?.trim() || undefined,
    email: payload.email?.trim() || undefined,
    region: payload.region?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
  };

  fournisseurs.value = [fournisseur, ...fournisseurs.value];
  return fournisseur;
}

export function useFournisseurService() {
  return {
    fournisseurs,
    addFournisseur,
  };
}
