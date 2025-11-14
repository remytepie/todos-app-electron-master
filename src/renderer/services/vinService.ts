import { computed, ref } from 'vue';
import Todo from 'src/shared/todo';

export type VinType = 'Rouge' | 'Blanc' | 'Rosé' | 'Effervescent' | 'Liquoreux' | 'Autre';

export interface Vin {
  id: number;
  nom: string;
  type: VinType;
  millesime?: number;
  region?: string;
  producteurId?: number;
  fournisseurId?: number;
  emplacementId?: number;
  notes?: string;
  tags: string[];
  stock: number;
  prixMoyen?: number;
  potentielGarde?: string;
  derniereMiseAJour: string;
}

export interface VinInput {
  nom: string;
  type: VinType;
  millesime?: number;
  region?: string;
  producteurId?: number;
  fournisseurId?: number;
  emplacementId?: number;
  notes?: string;
  tags?: string[];
  stock?: number;
  prixMoyen?: number;
  potentielGarde?: string;
}

const vins = ref<Vin[]>([
  {
    id: 1,
    nom: 'Château Margaux',
    type: 'Rouge',
    millesime: 2015,
    region: 'Bordeaux',
    producteurId: 1,
    fournisseurId: 1,
    emplacementId: 1,
    notes: 'Grand cru classé, à sortir pour les grandes occasions.',
    tags: ['Grand Cru', 'Collection'],
    stock: 12,
    prixMoyen: 680,
    potentielGarde: '2035+',
    derniereMiseAJour: new Date().toISOString(),
  },
  {
    id: 2,
    nom: 'Meursault Les Charmes',
    type: 'Blanc',
    millesime: 2018,
    region: 'Bourgogne',
    producteurId: 2,
    fournisseurId: 2,
    emplacementId: 2,
    notes: 'Très belle tension, parfait sur un poisson noble.',
    tags: ['Gastronomie'],
    stock: 9,
    prixMoyen: 120,
    potentielGarde: '2028',
    derniereMiseAJour: new Date().toISOString(),
  },
]);

let nextVinId = vins.value.length + 1;
let hasSyncedWithElectron = false;

function mapTodoToVin(todo: Todo): Vin {
  return {
    id: todo.id ?? nextVinId++,
    nom: todo.title,
    type: 'Rouge',
    region: todo.region ?? undefined,
    notes: todo.description ?? undefined,
    producteurId: undefined,
    fournisseurId: undefined,
    emplacementId: undefined,
    tags: todo.tags ?? [],
    stock: todo.isFinished ? 0 : 6,
    prixMoyen: undefined,
    potentielGarde: undefined,
    millesime: todo.dateLimite ? new Date(todo.dateLimite).getFullYear() : undefined,
    derniereMiseAJour: new Date().toISOString(),
  };
}

async function hydrateFromElectronTodos() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService || !window.electronService.todos) {
    return;
  }

  const todos = await window.electronService.todos.getTodos();
  if (!todos.length) {
    hasSyncedWithElectron = true;
    return;
  }

  vins.value = todos.map(mapTodoToVin);
  nextVinId = Math.max(...vins.value.map((v) => v.id)) + 1;
  hasSyncedWithElectron = true;
}

function buildVin(payload: VinInput): Vin {
  return {
    id: nextVinId++,
    nom: payload.nom.trim(),
    type: payload.type,
    millesime: payload.millesime,
    region: payload.region?.trim() || undefined,
    producteurId: payload.producteurId,
    fournisseurId: payload.fournisseurId,
    emplacementId: payload.emplacementId,
    notes: payload.notes?.trim() || undefined,
    tags: payload.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    stock: Math.max(0, payload.stock ?? 0),
    prixMoyen: payload.prixMoyen,
    potentielGarde: payload.potentielGarde?.trim() || undefined,
    derniereMiseAJour: new Date().toISOString(),
  };
}

function addVin(payload: VinInput) {
  const vin = buildVin(payload);
  vins.value = [vin, ...vins.value];
  return vin;
}

function updateVin(id: number, updates: Partial<Vin>) {
  const index = vins.value.findIndex((vin) => vin.id === id);
  if (index === -1) return null;

  const updated: Vin = {
    ...vins.value[index],
    ...updates,
    derniereMiseAJour: new Date().toISOString(),
  };

  vins.value.splice(index, 1, updated);
  return updated;
}

function adjustStock(vinId: number, delta: number) {
  const vin = vins.value.find((v) => v.id === vinId);
  if (!vin) {
    return;
  }

  vin.stock = Math.max(0, vin.stock + delta);
  vin.derniereMiseAJour = new Date().toISOString();
}

function getVinByIdRaw(id: number) {
  return vins.value.find((vin) => vin.id === id);
}

export function useVinStore() {
  const totalBottles = computed(() =>
    vins.value.reduce((acc, vin) => acc + vin.stock, 0),
  );

  const typeDistribution = computed(() => {
    return vins.value.reduce(
      (acc, vin) => {
        acc[vin.type] = (acc[vin.type] ?? 0) + vin.stock;
        return acc;
      },
      {} as Partial<Record<VinType, number>>,
    );
  });

  return {
    vins,
    totalBottles,
    typeDistribution,
    fetchVins: hydrateFromElectronTodos,
    addVin,
    updateVin,
    adjustStock,
    getVinById: (id: number) => computed(() => vins.value.find((vin) => vin.id === id)),
  };
}

export { adjustStock as adjustVinStock, getVinByIdRaw };
