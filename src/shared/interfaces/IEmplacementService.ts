import { EmplacementCreateInput, EmplacementRecord, EmplacementUpdateInput } from '../emplacement';

export default interface IEmplacementService {
  getEmplacements: () => Promise<EmplacementRecord[]>;
  addEmplacement: (data: EmplacementCreateInput) => Promise<EmplacementRecord>;
  updateEmplacement: (id: number, data: EmplacementUpdateInput) => Promise<EmplacementRecord>;
  deleteEmplacement: (id: number) => Promise<void>;
}
