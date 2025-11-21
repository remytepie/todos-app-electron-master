import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { VinRecord } from "src/shared/vin";

export class VinRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  async getVins(): Promise<VinRecord[]> {
    const vins = await this.dbclient.vin.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return vins.map((v) => ({
      id: v.id,
      nom: v.nom,
      type: v.type,
      millesime: v.millesime,
      region: v.region,
      pays: v.pays,
      producteurId: v.producteur_id,
      fournisseurId: v.fournisseur_id,
      emplacementId: v.emplacement_id,
      emplacementPrecision: v.emplacement_precision,
      notes: v.notes,
      stock: v.stock,
      prixMoyen: 0,
      potentielGarde: v.potentiel_garde,
      derniereMiseAJour: v.derniere_mise_a_jour
        ? v.derniere_mise_a_jour.toISOString()
        : null,
      tags: v.tags
        .map((assignment) => assignment.tag?.name)
        .filter((name): name is string => Boolean(name)),
    }));
  }
}
