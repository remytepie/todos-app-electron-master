import { ipcMain } from "electron";
import { MouvementRepository } from "./mouvementRepository";
import { MouvementCreateInput, MouvementUpdateInput } from "src/shared/mouvement";

export function registerMouvementRepository() {
  const mouvementRepository = new MouvementRepository();

  ipcMain.handle("mouvementRepository:getMouvements", () => {
    return mouvementRepository.getMouvements();
  });

  ipcMain.handle("mouvementRepository:addMouvement", (_e, mouvement: MouvementCreateInput) => {
    return mouvementRepository.addMouvement(mouvement);
  });

  ipcMain.handle("mouvementRepository:updateMouvement", (_e, id: number, mouvement: MouvementUpdateInput) => {
    return mouvementRepository.updateMouvement(id, mouvement);
  });

  ipcMain.handle("mouvementRepository:deleteMouvement", (_e, id: number) => {
    return mouvementRepository.deleteMouvement(id);
  });
}
