import { contextBridge, ipcRenderer } from "electron";
import { todoService } from "./todoService";
import IElectronService from "src/shared/interfaces/IElectronService";
import { vinService } from "./vinService";
import { fournisseurService } from "./fournisseurService";
import { mouvementService } from "./mouvementService";
import { emplacementService } from "./emplacementService";

contextBridge.exposeInMainWorld("electronService", {
    todos: todoService(),
    vins: vinService(),
    fournisseurs: fournisseurService(),
    mouvements: mouvementService(),
    emplacements: emplacementService(),
} as IElectronService)
