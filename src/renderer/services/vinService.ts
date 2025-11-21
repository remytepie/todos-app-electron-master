import { computed, ref } from 'vue';
import Todo from 'src/shared/todo';

export type VinType = 'Rouge' | 'Blanc' | 'Rosé' | 'Effervescent' | 'Liquoreux' | 'Autre';

export interface Vin {
  id: number;
  nom: string;
  type: VinType;
  millesime?: number;
  region?: string;
  pays?: string;
  fournisseurId?: number;
  emplacementId?: number;
  emplacementPrecision?: string;
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
  pays?: string;
  fournisseurId?: number;
  emplacementId?: number;
  emplacementPrecision?: string;
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
    pays: 'France',
    fournisseurId: 1,
    emplacementId: 1,
    emplacementPrecision: 'Rangée A · Case 1',
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
    pays: 'France',
    fournisseurId: 2,
    emplacementId: 2,
    emplacementPrecision: 'Colonne 2 · Niveau supérieur',
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
  pays: undefined,
  notes: todo.description ?? undefined,
  fournisseurId: undefined,
  emplacementId: undefined,
  emplacementPrecision: undefined,
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
  pays: payload.pays?.trim() || undefined,
  fournisseurId: payload.fournisseurId,
  emplacementId: payload.emplacementId,
    emplacementPrecision: payload.emplacementPrecision?.trim() || undefined,
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

function deleteVin(id: number) {
  const initialLength = vins.value.length;
  vins.value = vins.value.filter((vin) => vin.id !== id);
  return vins.value.length < initialLength;
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
    deleteVin,
    adjustStock,
    getVinById: (id: number) => computed(() => vins.value.find((vin) => vin.id === id)),
  };
}

export { adjustStock as adjustVinStock, getVinByIdRaw };

const MATURITY_DEFAULT_WINDOWS: Record<VinType, { startOffset: number; endOffset: number }> = {
  Rouge: { startOffset: 4, endOffset: 15 },
  Blanc: { startOffset: 2, endOffset: 8 },
  Rosé: { startOffset: 0, endOffset: 3 },
  Effervescent: { startOffset: 3, endOffset: 10 },
  Liquoreux: { startOffset: 3, endOffset: 12 },
  Autre: { startOffset: 1, endOffset: 6 },
};

export type MaturityLevel = 'upcoming' | 'optimal' | 'late';

export interface MaturityStatus {
  label: string;
  detail: string;
  level: MaturityLevel;
  window?: string;
}

function parsePotentielRange(value?: string): { start: number; end: number } | null {
  if (!value) return null;

  const matches = value.match(/\d{4}/g);
  if (!matches?.length) {
    return null;
  }

  const years = matches.map(Number).sort((a, b) => a - b);
  const start = years[0];
  let end = years[years.length - 1];

  if (value.includes('+') && years.length === 1) {
    end = start + 10;
  }

  return { start, end };
}

export function getMaturityStatus(vin: Vin): MaturityStatus {
  const currentYear = new Date().getFullYear();
  const potentielRange = parsePotentielRange(vin.potentielGarde);

  let rangeStart: number;
  let rangeEnd: number;

  if (potentielRange) {
    rangeStart = potentielRange.start;
    rangeEnd = potentielRange.end;
  } else {
    const { startOffset, endOffset } = MATURITY_DEFAULT_WINDOWS[vin.type] ?? MATURITY_DEFAULT_WINDOWS.Autre;
    const baseYear = vin.millesime ?? currentYear;
    rangeStart = baseYear + startOffset;
    rangeEnd = baseYear + endOffset;
  }

  if (rangeEnd < rangeStart) {
    rangeEnd = rangeStart;
  }

  const windowLabel = `${rangeStart} - ${rangeEnd}`;

  if (currentYear < rangeStart) {
    return {
      label: 'À attendre',
      detail: `Fenêtre estimée ${windowLabel}`,
      level: 'upcoming',
      window: windowLabel,
    };
  }

  if (currentYear <= rangeEnd) {
    return {
      label: 'Fenêtre optimale',
      detail: `Fenêtre estimée ${windowLabel}`,
      level: 'optimal',
      window: windowLabel,
    };
  }

  return {
    label: 'Dernières bouteilles',
    detail: `Fenêtre estimée ${windowLabel}`,
    level: 'late',
    window: windowLabel,
  };
}
