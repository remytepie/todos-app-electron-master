import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { FournisseurCreateInput, FournisseurRecord, FournisseurUpdateInput } from "src/shared/fournisseur";

export class FournisseurRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private mapRecord(f: any): FournisseurRecord {
    return {
      id: f.id,
      nom: f.nom,
      ville: f.ville,
      contact: f.contact,
      notes: f.notes,
    };
  }

  async getFournisseurs(): Promise<FournisseurRecord[]> {
    const fournisseurs = await this.dbclient.fournisseur.findMany({
      orderBy: { id: "asc" },
    });
    return fournisseurs.map((f) => this.mapRecord(f));
  }

  async addFournisseur(data: FournisseurCreateInput): Promise<FournisseurRecord> {
    const created = await this.dbclient.fournisseur.create({
      data: {
        nom: data.nom,
        ville: data.ville ?? null,
        contact: data.contact ?? null,
        notes: data.notes ?? null,
      },
    });

    return this.mapRecord(created);
  }

  async updateFournisseur(id: number, data: FournisseurUpdateInput): Promise<FournisseurRecord> {
    const updated = await this.dbclient.fournisseur.update({
      where: { id },
      data: {
        nom: data.nom,
        ville: data.ville,
        contact: data.contact,
        notes: data.notes,
      },
    });

    return this.mapRecord(updated);
  }

  async deleteFournisseur(id: number): Promise<void> {
    await this.dbclient.fournisseur.delete({ where: { id } });
  }
}
