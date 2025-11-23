import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./prisma/generated/client";
import {
  EmplacementCreateInput,
  EmplacementRecord,
  EmplacementUpdateInput,
  EmplacementType,
} from "src/shared/emplacement";

type NotesMeta = {
  type?: EmplacementType;
  capacite?: number | null;
  temperature?: string | null;
  humidite?: string | null;
  notes?: string | null;
};

function parseMeta(notes: string | null): NotesMeta & { raw: string | null } {
  if (!notes) return { raw: null };

  try {
    const parsed = JSON.parse(notes) as NotesMeta;
    if (parsed && typeof parsed === "object") {
      return { ...parsed, raw: parsed.notes ?? null };
    }
  } catch {
    // not JSON, treat as raw note
  }

  return { raw: notes };
}

function toNumberOrNull(value?: string | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function formatOptionalNumber(value: any): string | null {
  if (value === null || value === undefined) return null;
  return `${value}`;
}

function buildNotesMeta(input: EmplacementCreateInput | EmplacementUpdateInput): string | null {
  const meta: NotesMeta = {
    type: input.type,
    capacite: input.capacite ?? null,
    temperature: input.temperature ?? null,
    humidite: input.humidite ?? null,
    notes: input.notes ?? null,
  };
  return JSON.stringify(meta);
}

export class EmplacementRepository {
  private dbclient: PrismaClient;

  constructor() {
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
    this.dbclient = new PrismaClient({ adapter });
  }

  private mapRecord(e: any): EmplacementRecord {
    const meta = parseMeta(e.notes ?? null);

    return {
      id: e.id,
      nom: e.libelle,
      type: meta.type ?? "Autre",
      capacite: meta.capacite ?? null,
      temperature: meta.temperature ?? formatOptionalNumber(e.temperature),
      humidite: meta.humidite ?? formatOptionalNumber(e.humidite),
      notes: meta.raw ?? null,
    };
  }

  async getEmplacements(): Promise<EmplacementRecord[]> {
    const emplacements = await this.dbclient.emplacement.findMany({
      orderBy: { id: "asc" },
    });
    return emplacements.map((e) => this.mapRecord(e));
  }

  async addEmplacement(data: EmplacementCreateInput): Promise<EmplacementRecord> {
    const created = await this.dbclient.emplacement.create({
      data: {
        libelle: data.nom,
        temperature: toNumberOrNull(data.temperature),
        humidite: toNumberOrNull(data.humidite),
        notes: buildNotesMeta(data),
      },
    });

    return this.mapRecord(created);
  }

  async updateEmplacement(id: number, data: EmplacementUpdateInput): Promise<EmplacementRecord> {
    const updated = await this.dbclient.emplacement.update({
      where: { id },
      data: {
        libelle: data.nom,
        temperature: data.temperature !== undefined ? toNumberOrNull(data.temperature) : undefined,
        humidite: data.humidite !== undefined ? toNumberOrNull(data.humidite) : undefined,
        notes: data.type !== undefined ||
        data.capacite !== undefined ||
        data.temperature !== undefined ||
        data.humidite !== undefined ||
        data.notes !== undefined
          ? buildNotesMeta(data)
          : undefined,
      },
    });

    return this.mapRecord(updated);
  }

  async deleteEmplacement(id: number): Promise<void> {
    await this.dbclient.emplacement.delete({ where: { id } });
  }
}
