import { ipcMain } from "electron";
import { FournisseurRepository } from "./fournisseurRepository";
import { FournisseurCreateInput, FournisseurUpdateInput } from "src/shared/fournisseur";

export function registerFournisseurRepository() {
  const fournisseurRepository = new FournisseurRepository();

  ipcMain.handle("fournisseurRepository:getFournisseurs", () => {
    return fournisseurRepository.getFournisseurs();
  });

  ipcMain.handle("fournisseurRepository:addFournisseur", (_e, fournisseur: FournisseurCreateInput) => {
    return fournisseurRepository.addFournisseur(fournisseur);
  });

  ipcMain.handle(
    "fournisseurRepository:updateFournisseur",
    (_e, id: number, fournisseur: FournisseurUpdateInput) => {
      return fournisseurRepository.updateFournisseur(id, fournisseur);
    },
  );

  ipcMain.handle("fournisseurRepository:deleteFournisseur", (_e, id: number) => {
    return fournisseurRepository.deleteFournisseur(id);
  });
}
