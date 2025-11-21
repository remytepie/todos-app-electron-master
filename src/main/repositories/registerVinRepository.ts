import { ipcMain } from "electron";
import { VinRepository } from "./vinRepository";
import { VinCreateInput, VinUpdateInput } from "src/shared/vin";

export function registerVinRepository() {
  const vinRepository = new VinRepository();

  ipcMain.handle("vinRepository:getVins", () => {
    return vinRepository.getVins();
  });

  ipcMain.handle("vinRepository:addVin", (_e, vin: VinCreateInput) => {
    return vinRepository.addVin(vin);
  });

  ipcMain.handle("vinRepository:updateVin", (_e, id: number, vin: VinUpdateInput) => {
    return vinRepository.updateVin(id, vin);
  });

  ipcMain.handle("vinRepository:deleteVin", (_e, id: number) => {
    return vinRepository.deleteVin(id);
  });
}
