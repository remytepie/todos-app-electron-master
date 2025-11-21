import { ipcRenderer } from "electron";
import IVinService from "src/shared/interfaces/IVinService";
import { VinCreateInput, VinRecord, VinUpdateInput } from "src/shared/vin";

export function vinService(): IVinService {
  return {
    getVins: (): Promise<VinRecord[]> => ipcRenderer.invoke("vinRepository:getVins"),
    addVin: (vin: VinCreateInput): Promise<VinRecord> =>
      ipcRenderer.invoke("vinRepository:addVin", vin),
    updateVin: (id: number, vin: VinUpdateInput): Promise<VinRecord> =>
      ipcRenderer.invoke("vinRepository:updateVin", id, vin),
    deleteVin: (id: number): Promise<void> => ipcRenderer.invoke("vinRepository:deleteVin", id),
  };
}
