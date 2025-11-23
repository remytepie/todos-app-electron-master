import { MouvementCreateInput, MouvementRecord, MouvementUpdateInput } from '../mouvement';

export default interface IMouvementService {
  getMouvements: () => Promise<MouvementRecord[]>;
  addMouvement: (data: MouvementCreateInput) => Promise<MouvementRecord>;
  updateMouvement: (id: number, data: MouvementUpdateInput) => Promise<MouvementRecord>;
  deleteMouvement: (id: number) => Promise<void>;
}
