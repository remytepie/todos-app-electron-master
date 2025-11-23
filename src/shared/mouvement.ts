export type MouvementTypeDb = 'ENTREE' | 'SORTIE';

export interface MouvementRecord {
  id: number;
  vinId: number;
  type: MouvementTypeDb;
  quantite: number;
  date: string;
  commentaire: string | null;
  fournisseurId: number | null;
  emplacementId: number | null;
  vinNom?: string;
}

export interface MouvementCreateInput {
  vinId: number;
  type: MouvementTypeDb;
  quantite: number;
  date: string;
  commentaire?: string | null;
  fournisseurId?: number | null;
  emplacementId?: number | null;
}

export interface MouvementUpdateInput extends Partial<MouvementCreateInput> {}
