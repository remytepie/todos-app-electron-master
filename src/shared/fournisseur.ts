export interface FournisseurRecord {
  id: number;
  nom: string;
  ville: string | null;
  contact: string | null;
  notes: string | null;
}

export interface FournisseurCreateInput {
  nom: string;
  ville?: string | null;
  contact?: string | null;
  notes?: string | null;
}

export interface FournisseurUpdateInput extends Partial<FournisseurCreateInput> {}
