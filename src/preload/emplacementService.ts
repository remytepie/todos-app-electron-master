import { ipcRenderer } from "electron";
import IEmplacementService from "src/shared/interfaces/IEmplacementService";
import { EmplacementCreateInput, EmplacementRecord, EmplacementUpdateInput } from "src/shared/emplacement";

export function emplacementService(): IEmplacementService {
  return {
    getEmplacements: (): Promise<EmplacementRecord[]> => ipcRenderer.invoke("emplacementRepository:getEmplacements"),
    addEmplacement: (data: EmplacementCreateInput): Promise<EmplacementRecord> =>
      ipcRenderer.invoke("emplacementRepository:addEmplacement", data),
    updateEmplacement: (id: number, data: EmplacementUpdateInput): Promise<EmplacementRecord> =>
      ipcRenderer.invoke("emplacementRepository:updateEmplacement", id, data),
    deleteEmplacement: (id: number): Promise<void> =>
      ipcRenderer.invoke("emplacementRepository:deleteEmplacement", id),
  };
}
