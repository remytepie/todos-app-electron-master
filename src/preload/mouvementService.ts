import { ipcRenderer } from "electron";
import IMouvementService from "src/shared/interfaces/IMouvementService";
import { MouvementCreateInput, MouvementRecord, MouvementUpdateInput } from "src/shared/mouvement";

export function mouvementService(): IMouvementService {
  return {
    getMouvements: (): Promise<MouvementRecord[]> =>
      ipcRenderer.invoke("mouvementRepository:getMouvements"),
    addMouvement: (mouvement: MouvementCreateInput): Promise<MouvementRecord> =>
      ipcRenderer.invoke("mouvementRepository:addMouvement", mouvement),
    updateMouvement: (id: number, mouvement: MouvementUpdateInput): Promise<MouvementRecord> =>
      ipcRenderer.invoke("mouvementRepository:updateMouvement", id, mouvement),
    deleteMouvement: (id: number): Promise<void> =>
      ipcRenderer.invoke("mouvementRepository:deleteMouvement", id),
  };
}
