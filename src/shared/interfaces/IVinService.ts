import { VinCreateInput, VinRecord, VinUpdateInput } from "../vin";

export default interface IVinService {
  getVins: () => Promise<VinRecord[]>;
  addVin: (vin: VinCreateInput) => Promise<VinRecord>;
  updateVin: (id: number, vin: VinUpdateInput) => Promise<VinRecord>;
  deleteVin: (id: number) => Promise<void>;
}
