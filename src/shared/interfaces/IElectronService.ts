import ITodoService from "./ITodoService";
import IVinService from "./IVinService";

export default interface IElectronService {
    todos: ITodoService
    vins: IVinService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}
