import { ipcRenderer } from "electron";
import IFournisseurService from "src/shared/interfaces/IFournisseurService";
import { FournisseurCreateInput, FournisseurRecord, FournisseurUpdateInput } from "src/shared/fournisseur";

export function fournisseurService(): IFournisseurService {
  return {
    getFournisseurs: (): Promise<FournisseurRecord[]> =>
      ipcRenderer.invoke("fournisseurRepository:getFournisseurs"),
    addFournisseur: (fournisseur: FournisseurCreateInput): Promise<FournisseurRecord> =>
      ipcRenderer.invoke("fournisseurRepository:addFournisseur", fournisseur),
    updateFournisseur: (id: number, fournisseur: FournisseurUpdateInput): Promise<FournisseurRecord> =>
      ipcRenderer.invoke("fournisseurRepository:updateFournisseur", id, fournisseur),
    deleteFournisseur: (id: number): Promise<void> =>
      ipcRenderer.invoke("fournisseurRepository:deleteFournisseur", id),
  };
}
