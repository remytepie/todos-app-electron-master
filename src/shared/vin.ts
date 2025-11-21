export type VinTypeDb = 'ROUGE' | 'BLANC' | 'ROSE' | 'EFFERVESCENT' | 'LIQUOREUX' | 'AUTRE';

export interface VinRecord {
  id: number;
  nom: string;
  type: VinTypeDb;
  millesime: number | null;
  region: string | null;
  pays: string | null;
  producteurId: number | null;
  fournisseurId: number | null;
  emplacementId: number | null;
  emplacementPrecision: string | null;
  notes: string | null;
  stock: number;
  prixMoyen: number | null;
  potentielGarde: string | null;
  derniereMiseAJour: string | null;
  tags: string[];
}

export interface VinCreateInput {
  nom: string;
  type: VinTypeDb;
  millesime?: number | null;
  region?: string | null;
  pays?: string | null;
  producteurId?: number | null;
  fournisseurId?: number | null;
  emplacementId?: number | null;
  emplacementPrecision?: string | null;
  notes?: string | null;
  stock?: number;
  prixMoyen?: number | null;
  potentielGarde?: string | null;
  tags?: string[];
}

export interface VinUpdateInput extends Partial<VinCreateInput> {}
