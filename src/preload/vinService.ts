import { ipcRenderer } from "electron";
import IVinService from "src/shared/interfaces/IVinService";
import { VinRecord } from "src/shared/vin";

export function vinService(): IVinService {
  return {
    getVins: (): Promise<VinRecord[]> => ipcRenderer.invoke("vinRepository:getVins"),
  };
}
