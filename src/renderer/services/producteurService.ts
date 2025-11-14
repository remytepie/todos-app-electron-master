import { ref } from 'vue';

export interface Producteur {
  id: number;
  nom: string;
  domaine?: string;
  region?: string;
  certification?: string;
  notes?: string;
}

export interface ProducteurInput {
  nom: string;
  domaine?: string;
  region?: string;
  certification?: string;
  notes?: string;
}

const producteurs = ref<Producteur[]>([
  {
    id: 1,
    nom: 'Château Margaux',
    domaine: 'Margaux',
    region: 'Bordeaux',
    certification: 'Grand Cru Classé',
    notes: 'Production suivie depuis 2012.',
  },
  {
    id: 2,
    nom: 'Domaine Roulot',
    domaine: 'Meursault',
    region: 'Bourgogne',
    certification: 'Bio',
    notes: 'Stock alloué à l’année.',
  },
]);

let nextProducteurId = producteurs.value.length + 1;

function addProducteur(payload: ProducteurInput) {
  const producteur: Producteur = {
    id: nextProducteurId++,
    nom: payload.nom.trim(),
    domaine: payload.domaine?.trim() || undefined,
    region: payload.region?.trim() || undefined,
    certification: payload.certification?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
  };

  producteurs.value = [producteur, ...producteurs.value];
  return producteur;
}

export function useProducteurService() {
  return {
    producteurs,
    addProducteur,
  };
}
