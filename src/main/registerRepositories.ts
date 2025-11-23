import { registerVinRepository } from "./repositories/registerVinRepository";
import { registerFournisseurRepository } from "./repositories/registerFournisseurRepository";
import { registerMouvementRepository } from "./repositories/registerMouvementRepository";
import { registerEmplacementRepository } from "./repositories/registerEmplacementRepository";

export function registerRepositories()
{
    registerVinRepository();
    registerFournisseurRepository();
    registerMouvementRepository();
    registerEmplacementRepository();
}
