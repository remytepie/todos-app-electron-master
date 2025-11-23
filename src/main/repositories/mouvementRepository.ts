import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { MouvementCreateInput, MouvementRecord, MouvementUpdateInput } from "src/shared/mouvement";

export class MouvementRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private mapRecord(m: any): MouvementRecord {
    return {
      id: m.id,
      vinId: m.vin_id,
      type: m.type,
      quantite: m.quantite,
      date: m.date.toISOString(),
      commentaire: m.commentaire,
      fournisseurId: m.fournisseur_id,
      emplacementId: m.emplacement_id,
      vinNom: m.vin?.nom,
    };
  }

  async getMouvements(): Promise<MouvementRecord[]> {
    const mouvements = await this.dbclient.mouvement.findMany({
      include: {
        vin: {
          select: { nom: true },
        },
      },
      orderBy: { date: "desc" },
    });
    return mouvements.map((m) => this.mapRecord(m));
  }

  async addMouvement(data: MouvementCreateInput): Promise<MouvementRecord> {
    const created = await this.dbclient.mouvement.create({
      data: {
        vin_id: data.vinId,
        type: data.type,
        quantite: data.quantite,
        date: new Date(data.date),
        commentaire: data.commentaire ?? null,
        fournisseur_id: data.fournisseurId ?? null,
        emplacement_id: data.emplacementId ?? null,
      },
      include: {
        vin: {
          select: { nom: true },
        },
      },
    });
    return this.mapRecord(created);
  }

  async updateMouvement(id: number, data: MouvementUpdateInput): Promise<MouvementRecord> {
    const updated = await this.dbclient.mouvement.update({
      where: { id },
      data: {
        vin_id: data.vinId,
        type: data.type,
        quantite: data.quantite,
        date: data.date ? new Date(data.date) : undefined,
        commentaire: data.commentaire ?? undefined,
        fournisseur_id: data.fournisseurId ?? undefined,
        emplacement_id: data.emplacementId ?? undefined,
      },
      include: {
        vin: {
          select: { nom: true },
        },
      },
    });
    return this.mapRecord(updated);
  }

  async deleteMouvement(id: number): Promise<void> {
    await this.dbclient.mouvement.delete({ where: { id } });
  }
}
