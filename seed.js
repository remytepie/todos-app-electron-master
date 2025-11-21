const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const legacyTags = ['Grand Cru', 'Collection', 'Gastronomie', 'Degustation'];
const legacyTodos = [
  {
    title: 'Puligny-Montrachet 1er Cru Les Pucelles 2018',
    details: {
      description: 'Chardonnay tendu et cristallin.',
      producer: 'Domaine Leflaive',
      region: 'Bourgogne',
    },
    dueDate: '2030-05-01T00:00:00',
    tags: ['Grand Cru', 'Gastronomie'],
  },
  {
    title: 'Chateau Margaux 2015',
    details: {
      description: 'Assemblage cabernet/merlot avec un grand potentiel.',
      producer: 'Chateau Margaux',
      region: 'Bordeaux',
    },
    dueDate: '2035-01-01T00:00:00',
    tags: ['Grand Cru', 'Collection'],
  },
  {
    title: 'Sancerre Blanc Les Romains 2022',
    details: {
      description: 'Sauvignon blanc droit et salin.',
      producer: 'Domaine Vacheron',
      region: 'Loire',
    },
    dueDate: '2028-06-15T00:00:00',
    tags: ['Gastronomie', 'Degustation'],
  },
];

const producteurSeed = [
  {
    code: 'leflaive',
    data: {
      nom: 'Domaine Leflaive',
      domaine: 'Puligny-Montrachet',
      region: 'Bourgogne',
      certification: 'Biodynamique',
      notes: 'Suivi des cuvees les plus rares.',
    },
  },
  {
    code: 'margaux',
    data: {
      nom: 'Chateau Margaux',
      domaine: 'Margaux',
      region: 'Bordeaux',
      certification: 'Grand Cru Classe',
      notes: 'Grand vin uniquement sorti pour les grandes occasions.',
    },
  },
  {
    code: 'vacheron',
    data: {
      nom: 'Domaine Vacheron',
      domaine: 'Sancerre',
      region: 'Loire',
      certification: 'Bio',
      notes: 'Tres belles expressions du sauvignon blanc.',
    },
  },
];

const fournisseurSeed = [
  {
    code: 'maison',
    data: {
      nom: 'La Maison du Vin',
      ville: 'Bordeaux',
      contact: 'contact@maisonduvin.fr',
      notes: 'Allocations historiques.',
    },
  },
  {
    code: 'cavistes',
    data: {
      nom: 'Cavistes & Co',
      ville: 'Paris',
      contact: 'contact@cavistes.co',
      notes: 'Livraison rapide sur Paris.',
    },
  },
  {
    code: 'primeurs',
    data: {
      nom: 'Primeurs Excellence',
      ville: 'Lyon',
      contact: 'primeurs@excellence.fr',
      notes: 'Specialiste des millesimes jeunes.',
    },
  },
];

const emplacementSeed = [
  {
    code: 'cave',
    data: {
      libelle: 'Cave principale',
      temperature: 12.0,
      humidite: 70.0,
      notes: 'Casier en pierre, hygrometrie controlee.',
    },
  },
  {
    code: 'armoire',
    data: {
      libelle: 'Armoire degustation',
      temperature: 18.0,
      humidite: 60.0,
      notes: 'Armoire a ouverture rapide pour les bouteilles a sortir.',
    },
  },
  {
    code: 'reserve',
    data: {
      libelle: 'Reserve famille',
      temperature: 10.0,
      humidite: 75.0,
      notes: 'Zone reservee aux grands formats.',
    },
  },
];

const vinTagSeed = [
  { code: 'grand_cru', name: 'Grand Cru' },
  { code: 'collection', name: 'Collection' },
  { code: 'gastronomie', name: 'Gastronomie' },
  { code: 'degustation', name: 'Degustation' },
  { code: 'allocation', name: 'Allocation' },
];

const vinSeed = [
  {
    code: 'puligny',
    data: {
      nom: 'Puligny-Montrachet 1er Cru Les Pucelles',
      type: 'BLANC',
      millesime: 2018,
      region: 'Bourgogne',
      pays: 'France',
      producteurCode: 'leflaive',
      fournisseurCode: 'maison',
      emplacementCode: 'cave',
      emplacement_precision: 'Rangee A - Case 1',
      notes: 'Chardonnay vibrant avec une grande profondeur.',
      stock: 12,
      prix_moyen: 260.0,
      potentiel_garde: '2025-2034',
      derniere_mise_a_jour: '2024-05-01T10:00:00',
    },
    tags: ['grand_cru', 'gastronomie', 'allocation'],
  },
  {
    code: 'margaux',
    data: {
      nom: 'Chateau Margaux',
      type: 'ROUGE',
      millesime: 2015,
      region: 'Bordeaux',
      pays: 'France',
      producteurCode: 'margaux',
      fournisseurCode: 'cavistes',
      emplacementCode: 'cave',
      emplacement_precision: 'Rangee B - Case 3',
      notes: 'Cabernet sauvignon intense, finale interminable.',
      stock: 6,
      prix_moyen: 690.0,
      potentiel_garde: '2030-2040',
      derniere_mise_a_jour: '2024-04-18T09:15:00',
    },
    tags: ['grand_cru', 'collection'],
  },
  {
    code: 'sancerre',
    data: {
      nom: 'Sancerre Blanc Les Romains',
      type: 'BLANC',
      millesime: 2022,
      region: 'Loire',
      pays: 'France',
      producteurCode: 'vacheron',
      fournisseurCode: 'primeurs',
      emplacementCode: 'armoire',
      emplacement_precision: 'Colonne 2 - Niveau haut',
      notes: 'Sauvignon blanc salin et citronne.',
      stock: 24,
      prix_moyen: 42.0,
      potentiel_garde: '2024-2028',
      derniere_mise_a_jour: '2024-06-10T14:32:00',
    },
    tags: ['gastronomie', 'degustation'],
  },
];

const mouvementSeed = [
  {
    vinCode: 'puligny',
    type: 'ENTREE',
    quantite: 12,
    date: '2024-01-10T11:00:00',
    commentaire: 'Allocation primeur',
    fournisseurCode: 'maison',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'margaux',
    type: 'ENTREE',
    quantite: 6,
    date: '2024-02-05T08:30:00',
    commentaire: 'Livraison cavistes',
    fournisseurCode: 'cavistes',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'puligny',
    type: 'SORTIE',
    quantite: 2,
    date: '2024-03-22T19:45:00',
    commentaire: 'Degustation club',
    emplacementCode: 'armoire',
  },
  {
    vinCode: 'sancerre',
    type: 'ENTREE',
    quantite: 24,
    date: '2024-04-15T10:20:00',
    commentaire: 'Arrivee millesime 2022',
    fournisseurCode: 'primeurs',
    emplacementCode: 'armoire',
  },
];

async function seedLegacyTodos() {
  console.log('Resetting legacy todo tables...');
  await prisma.todo_tags.deleteMany();
  await prisma.todos.deleteMany();
  await prisma.tags.deleteMany();

  const tagRecords = {};
  for (const name of legacyTags) {
    const record = await prisma.tags.create({ data: { name } });
    tagRecords[name] = record;
  }

  for (const todo of legacyTodos) {
    const record = await prisma.todos.create({
      data: {
        title: todo.title,
        description: JSON.stringify(todo.details),
        due_date: new Date(todo.dueDate),
        is_finished: false,
      },
    });

    for (const tagName of todo.tags) {
      const tag = tagRecords[tagName];
      if (tag) {
        await prisma.todo_tags.create({
          data: {
            todo_id: record.id,
            tag_id: tag.id,
          },
        });
      }
    }
  }

  console.log(`Inserted ${legacyTodos.length} todos and ${legacyTags.length} tags.`);
}

async function seedWineDomain() {
  console.log('Resetting wine domain tables...');
  await prisma.mouvement.deleteMany();
  await prisma.vinTagAssignment.deleteMany();
  await prisma.vin.deleteMany();
  await prisma.vinTag.deleteMany();
  await prisma.emplacement.deleteMany();
  await prisma.fournisseur.deleteMany();
  await prisma.producteur.deleteMany();

  const producteurs = {};
  for (const entry of producteurSeed) {
    producteurs[entry.code] = await prisma.producteur.create({ data: entry.data });
  }

  const fournisseurs = {};
  for (const entry of fournisseurSeed) {
    fournisseurs[entry.code] = await prisma.fournisseur.create({ data: entry.data });
  }

  const emplacements = {};
  for (const entry of emplacementSeed) {
    emplacements[entry.code] = await prisma.emplacement.create({ data: entry.data });
  }

  const vinTags = {};
  for (const entry of vinTagSeed) {
    vinTags[entry.code] = await prisma.vinTag.create({ data: { name: entry.name } });
  }

  const vins = {};
  for (const entry of vinSeed) {
    const data = {
      nom: entry.data.nom,
      type: entry.data.type,
      millesime: entry.data.millesime,
      region: entry.data.region,
      pays: entry.data.pays,
      emplacement_precision: entry.data.emplacement_precision,
      notes: entry.data.notes,
      stock: entry.data.stock,
      prix_moyen: entry.data.prix_moyen,
      potentiel_garde: entry.data.potentiel_garde,
      derniere_mise_a_jour: new Date(entry.data.derniere_mise_a_jour),
    };

    if (entry.data.producteurCode) {
      data.producteur = {
        connect: { id: producteurs[entry.data.producteurCode].id },
      };
    }

    if (entry.data.fournisseurCode) {
      data.fournisseur = {
        connect: { id: fournisseurs[entry.data.fournisseurCode].id },
      };
    }

    if (entry.data.emplacementCode) {
      data.emplacement = {
        connect: { id: emplacements[entry.data.emplacementCode].id },
      };
    }

    vins[entry.code] = await prisma.vin.create({ data });
  }

  for (const entry of vinSeed) {
    const vin = vins[entry.code];
    for (const tagCode of entry.tags) {
      const tag = vinTags[tagCode];
      if (vin && tag) {
        await prisma.vinTagAssignment.create({
          data: {
            vin: { connect: { id: vin.id } },
            tag: { connect: { id: tag.id } },
          },
        });
      }
    }
  }

  for (const mouvement of mouvementSeed) {
    const data = {
      vin: { connect: { id: vins[mouvement.vinCode].id } },
      type: mouvement.type,
      quantite: mouvement.quantite,
      date: new Date(mouvement.date),
      commentaire: mouvement.commentaire,
    };

    if (mouvement.fournisseurCode) {
      data.fournisseur = {
        connect: { id: fournisseurs[mouvement.fournisseurCode].id },
      };
    }

    if (mouvement.emplacementCode) {
      data.emplacement = {
        connect: { id: emplacements[mouvement.emplacementCode].id },
      };
    }

    await prisma.mouvement.create({ data });
  }

  console.log('Wine domain seed completed.');
}

async function main() {
  await seedLegacyTodos();
  await seedWineDomain();
}

main()
  .then(() => {
    console.log('Seed finished successfully.');
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
