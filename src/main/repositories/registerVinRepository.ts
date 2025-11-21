import { ipcMain } from "electron";
import { VinRepository } from "./vinRepository";

export function registerVinRepository() {
  const vinRepository = new VinRepository();

  ipcMain.handle("vinRepository:getVins", () => {
    return vinRepository.getVins();
  });
}
