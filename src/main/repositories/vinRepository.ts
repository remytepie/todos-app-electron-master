import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import { VinCreateInput, VinRecord, VinUpdateInput } from "src/shared/vin";

export class VinRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private toNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  private mapRecord(v: any): VinRecord {
    return {
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
      prixMoyen: this.toNumber(v.prix_moyen),
      potentielGarde: v.potentiel_garde,
      derniereMiseAJour: v.derniere_mise_a_jour ? v.derniere_mise_a_jour.toISOString() : null,
      tags:
        v.tags
          ?.map((assignment: any) => assignment.tag?.name)
          .filter((name: string | undefined): name is string => Boolean(name)) ?? [],
    };
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

    return vins.map((v) => this.mapRecord(v));
  }

  async addVin(data: VinCreateInput): Promise<VinRecord> {
    const created = await this.dbclient.vin.create({
      data: {
        nom: data.nom,
        type: data.type,
        millesime: data.millesime ?? null,
        region: data.region ?? null,
        pays: data.pays ?? null,
        producteur_id: data.producteurId ?? null,
        fournisseur_id: data.fournisseurId ?? null,
        emplacement_id: data.emplacementId ?? null,
        emplacement_precision: data.emplacementPrecision ?? null,
        notes: data.notes ?? null,
        stock: data.stock ?? 0,
        prix_moyen: data.prixMoyen ?? null,
        potentiel_garde: data.potentielGarde ?? null,
        tags: data.tags?.length
          ? {
              create: data.tags.map((name) => ({
                tag: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    return this.mapRecord(created);
  }

  async updateVin(id: number, data: VinUpdateInput): Promise<VinRecord> {
    const updated = await this.dbclient.vin.update({
      where: { id },
      data: {
        nom: data.nom,
        type: data.type,
        millesime: data.millesime,
        region: data.region,
        pays: data.pays,
        producteur_id: data.producteurId,
        fournisseur_id: data.fournisseurId,
        emplacement_id: data.emplacementId,
        emplacement_precision: data.emplacementPrecision,
        notes: data.notes,
        stock: data.stock,
        prix_moyen: data.prixMoyen,
        potentiel_garde: data.potentielGarde,
        ...(data.tags
          ? {
              tags: {
                deleteMany: {},
                create: data.tags.map((name) => ({
                  tag: {
                    connectOrCreate: {
                      where: { name },
                      create: { name },
                    },
                  },
                })),
              },
            }
          : {}),
      },
      include: { tags: { include: { tag: true } } },
    });

    return this.mapRecord(updated);
  }

  async deleteVin(id: number): Promise<void> {
    await this.dbclient.vin.delete({ where: { id } });
  }
}
