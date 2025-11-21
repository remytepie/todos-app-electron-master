import { contextBridge, ipcRenderer } from "electron";
import { todoService } from "./todoService";
import IElectronService from "src/shared/interfaces/IElectronService";
import { vinService } from "./vinService";

contextBridge.exposeInMainWorld("electronService", {
    todos: todoService(),
    vins: vinService(),
} as IElectronService)
