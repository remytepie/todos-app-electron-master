import { computed, ref } from 'vue';
import { VinRecord, VinTypeDb } from 'src/shared/vin';

export type VinType = 'Rouge' | 'Blanc' | 'Rose' | 'Effervescent' | 'Liquoreux' | 'Autre';

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
  potentielGarde?: string;
}

const vins = ref<Vin[]>([]);
let nextVinId = 1;
let hasSyncedWithElectron = false;

const vinTypeMap: Record<VinTypeDb, VinType> = {
  ROUGE: 'Rouge',
  BLANC: 'Blanc',
  ROSE: 'Rose',
  EFFERVESCENT: 'Effervescent',
  LIQUOREUX: 'Liquoreux',
  AUTRE: 'Autre',
};

const invertVinTypeMap: Record<VinType, VinTypeDb> = {
  Rouge: 'ROUGE',
  Blanc: 'BLANC',
  Rose: 'ROSE',
  Effervescent: 'EFFERVESCENT',
  Liquoreux: 'LIQUOREUX',
  Autre: 'AUTRE',
};
const vinTypesAllowed = new Set<VinType>(['Rouge', 'Blanc', 'Rose', 'Effervescent', 'Liquoreux', 'Autre']);

function assertVinPayload(
  payload: Partial<Vin> | VinInput,
  { partial }: { partial: boolean },
): asserts payload is typeof payload {
  if (!partial) {
    if (!payload.nom?.trim()) throw new Error('Le nom du vin est obligatoire');
    if (!payload.type || !vinTypesAllowed.has(payload.type)) throw new Error('Type de vin invalide');
  } else if (payload.type !== undefined && !vinTypesAllowed.has(payload.type)) {
    throw new Error('Type de vin invalide');
  }

  if (payload.millesime !== undefined) {
    const year = payload.millesime;
    if (Number.isNaN(year) || year < 1900 || year > 2100) {
      throw new Error('Millesime invalide');
    }
  }

  if (payload.stock !== undefined && payload.stock < 0) {
    throw new Error('Le stock doit etre positif');
  }
}

function mapVinRecordToVin(record: VinRecord): Vin {
  return {
    id: record.id,
    nom: record.nom,
    type: vinTypeMap[record.type] ?? 'Autre',
    millesime: record.millesime ?? undefined,
    region: record.region ?? undefined,
    pays: record.pays ?? undefined,
    fournisseurId: record.fournisseurId ?? undefined,
    emplacementId: record.emplacementId ?? undefined,
    emplacementPrecision: record.emplacementPrecision ?? undefined,
    notes: record.notes ?? undefined,
    tags: record.tags ?? [],
    stock: record.stock ?? 0,
    potentielGarde: record.potentielGarde ?? undefined,
    derniereMiseAJour: record.derniereMiseAJour ?? new Date().toISOString(),
  };
}

async function hydrateFromElectron() {
  if (typeof window === 'undefined') {
    hasSyncedWithElectron = true;
    return;
  }

  if (hasSyncedWithElectron || !window.electronService || !window.electronService.vins) {
    return;
  }

  const remoteVins = await window.electronService.vins.getVins();
  vins.value = remoteVins.map(mapVinRecordToVin);
  nextVinId = vins.value.length ? Math.max(...vins.value.map((v) => v.id)) + 1 : 1;
  hasSyncedWithElectron = true;
}

async function addVin(payload: VinInput) {
  assertVinPayload(payload, { partial: false });

  if (typeof window !== 'undefined' && window.electronService?.vins) {
    try {
      const created = await window.electronService.vins.addVin({
        nom: payload.nom.trim(),
        type: invertVinTypeMap[payload.type] ?? 'AUTRE',
        millesime: payload.millesime ?? null,
        region: payload.region?.trim() || null,
        pays: payload.pays?.trim() || null,
        producteurId: null,
        fournisseurId: payload.fournisseurId ?? null,
        emplacementId: payload.emplacementId ?? null,
        emplacementPrecision: payload.emplacementPrecision?.trim() || null,
        notes: payload.notes?.trim() || null,
        stock: Math.max(0, payload.stock ?? 0),
        potentielGarde: payload.potentielGarde?.trim() || null,
        tags: payload.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
      });
      const vin = mapVinRecordToVin(created);
      vins.value = [vin, ...vins.value];
      return vin;
    } catch (err) {
      console.error('addVin failed', err);
    }
  }

  const fallback: Vin = {
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
    potentielGarde: payload.potentielGarde?.trim() || undefined,
    derniereMiseAJour: new Date().toISOString(),
  };
  vins.value = [fallback, ...vins.value];
  return fallback;
}

async function updateVin(id: number, updates: Partial<Vin>) {
  assertVinPayload(updates, { partial: true });

  if (typeof window !== 'undefined' && window.electronService?.vins) {
    try {
      const updatedRecord = await window.electronService.vins.updateVin(id, {
        nom: updates.nom,
        type: updates.type ? invertVinTypeMap[updates.type] ?? 'AUTRE' : undefined,
        millesime: updates.millesime ?? null,
        region: updates.region ?? null,
        pays: updates.pays ?? null,
        producteurId: undefined,
        fournisseurId: updates.fournisseurId ?? null,
        emplacementId: updates.emplacementId ?? null,
        emplacementPrecision: updates.emplacementPrecision ?? null,
        notes: updates.notes ?? null,
        stock: updates.stock,
        potentielGarde: updates.potentielGarde ?? null,
        tags: updates.tags,
      });
      const vin = mapVinRecordToVin(updatedRecord);
      const idx = vins.value.findIndex((v) => v.id === id);
      if (idx >= 0) {
        vins.value.splice(idx, 1, vin);
      }
      return vin;
    } catch (err) {
      console.error('updateVin failed', err);
    }
  }

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

async function deleteVin(id: number) {
  if (typeof window !== 'undefined' && window.electronService?.vins) {
    try {
      await window.electronService.vins.deleteVin(id);
    } catch (err) {
      console.error('deleteVin failed', err);
    }
  }
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
    fetchVins: hydrateFromElectron,
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
  Rose: { startOffset: 0, endOffset: 3 },
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

function parseGuardYears(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/\d+/);
  if (!match) return null;
  if (/an/i.test(value) || /ans/i.test(value)) {
    return Number(match[0]);
  }
  return null;
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
  const guardYears = parseGuardYears(vin.potentielGarde);
  const potentielRange = guardYears ? null : parsePotentielRange(vin.potentielGarde);

  let rangeStart: number;
  let rangeEnd: number;

  if (guardYears) {
    rangeStart = (vin.millesime ?? currentYear) + guardYears;
    rangeEnd = rangeStart;
  } else if (potentielRange) {
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
      label: 'A attendre',
      detail: `Fenetre estimee ${windowLabel}`,
      level: 'upcoming',
      window: windowLabel,
    };
  }

  if (currentYear <= rangeEnd) {
    return {
      label: 'Fenetre optimale',
      detail: `Fenetre estimee ${windowLabel}`,
      level: 'optimal',
      window: windowLabel,
    };
  }

  return {
    label: 'Dernieres bouteilles',
    detail: `Fenetre estimee ${windowLabel}`,
    level: 'late',
    window: windowLabel,
  };
}
