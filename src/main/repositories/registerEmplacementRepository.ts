import { ipcMain } from "electron";
import { EmplacementRepository } from "./emplacementRepository";
import { EmplacementCreateInput, EmplacementUpdateInput } from "src/shared/emplacement";

export function registerEmplacementRepository() {
  const emplacementRepository = new EmplacementRepository();

  ipcMain.handle("emplacementRepository:getEmplacements", () => {
    return emplacementRepository.getEmplacements();
  });

  ipcMain.handle("emplacementRepository:addEmplacement", (_e, emplacement: EmplacementCreateInput) => {
    return emplacementRepository.addEmplacement(emplacement);
  });

  ipcMain.handle(
    "emplacementRepository:updateEmplacement",
    (_e, id: number, emplacement: EmplacementUpdateInput) => {
      return emplacementRepository.updateEmplacement(id, emplacement);
    },
  );

  ipcMain.handle("emplacementRepository:deleteEmplacement", (_e, id: number) => {
    return emplacementRepository.deleteEmplacement(id);
  });
}
