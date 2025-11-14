import { ref } from 'vue';

export interface Emplacement {
  id: number;
  nom: string;
  type: 'Cave' | 'Casier' | 'Armoire' | 'Autre';
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

const emplacements = ref<Emplacement[]>([
  {
    id: 1,
    nom: 'Cave principale',
    type: 'Cave',
    capacite: 500,
    temperature: '12°C',
    humidite: '70%',
    notes: 'Stabilité exemplaire, parfaite pour les grands crus.',
  },
  {
    id: 2,
    nom: 'Armoire service',
    type: 'Armoire',
    capacite: 60,
    temperature: '10-14°C',
    humidite: '60%',
    notes: 'Pour les bouteilles prêtes à boire.',
  },
]);

let nextEmplacementId = emplacements.value.length + 1;

function addEmplacement(payload: EmplacementInput) {
  const emplacement: Emplacement = {
    id: nextEmplacementId++,
    nom: payload.nom.trim(),
    type: payload.type,
    capacite: payload.capacite,
    temperature: payload.temperature?.trim() || undefined,
    humidite: payload.humidite?.trim() || undefined,
    notes: payload.notes?.trim() || undefined,
  };

  emplacements.value = [emplacement, ...emplacements.value];
  return emplacement;
}

export function useEmplacementService() {
  return {
    emplacements,
    addEmplacement,
  };
}
