import { FournisseurCreateInput, FournisseurRecord, FournisseurUpdateInput } from '../fournisseur';

export default interface IFournisseurService {
  getFournisseurs: () => Promise<FournisseurRecord[]>;
  addFournisseur: (data: FournisseurCreateInput) => Promise<FournisseurRecord>;
  updateFournisseur: (id: number, data: FournisseurUpdateInput) => Promise<FournisseurRecord>;
  deleteFournisseur: (id: number) => Promise<void>;
}
