import { VinRecord } from "../vin";

export default interface IVinService {
  getVins: () => Promise<VinRecord[]>;
}
