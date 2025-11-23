import ITodoService from "./ITodoService";
import IVinService from "./IVinService";
import IFournisseurService from "./IFournisseurService";
import IMouvementService from "./IMouvementService";
import IEmplacementService from "./IEmplacementService";

export default interface IElectronService {
    todos: ITodoService
    vins: IVinService
    fournisseurs: IFournisseurService
    mouvements: IMouvementService
    emplacements: IEmplacementService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}
