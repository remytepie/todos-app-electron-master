export type EmplacementType = 'Cave' | 'Casier' | 'Armoire' | 'Autre';

export interface EmplacementRecord {
  id: number;
  nom: string;
  type: EmplacementType;
  capacite: number | null;
  temperature: string | null;
  humidite: string | null;
  notes: string | null;
}

export interface EmplacementCreateInput {
  nom: string;
  type: EmplacementType;
  capacite?: number | null;
  temperature?: string | null;
  humidite?: string | null;
  notes?: string | null;
}

export interface EmplacementUpdateInput extends Partial<EmplacementCreateInput> {}
