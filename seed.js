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
  {
    code: 'scavino',
    data: {
      nom: 'Paolo Scavino',
      domaine: 'Cannubi',
      region: 'Piemont',
      certification: null,
      notes: 'Nebbiolo de parcelles historiques.',
    },
  },
  {
    code: 'lopez',
    data: {
      nom: 'Lopez de Heredia',
      domaine: 'Vina Tondonia',
      region: 'Rioja',
      certification: null,
      notes: 'Elevages tres longs en foudre.',
    },
  },
  {
    code: 'banfi',
    data: {
      nom: 'Castello Banfi',
      domaine: 'Montalcino',
      region: 'Toscane',
      certification: 'Durable',
      notes: 'Brunello structure sur le sangiovese.',
    },
  },
  {
    code: 'trimbach',
    data: {
      nom: 'Trimbach',
      domaine: 'Ribeauville',
      region: 'Alsace',
      certification: null,
      notes: 'Rieslings secs de longue garde.',
    },
  },
  {
    code: 'kistler',
    data: {
      nom: 'Kistler Vineyards',
      domaine: 'Sonoma Coast',
      region: 'Californie',
      certification: null,
      notes: 'Chardonnays boise elegants des Etats-Unis.',
    },
  },
  {
    code: 'selosse',
    data: {
      nom: 'Jacques Selosse',
      domaine: 'Avize',
      region: 'Champagne',
      certification: 'Biodynamie',
      notes: 'Champagnes de vigneron a forte personnalite.',
    },
  },
  {
    code: 'graham',
    data: {
      nom: 'Grahams',
      domaine: 'Porto',
      region: 'Douro',
      certification: null,
      notes: 'Portos vintage puissants.',
    },
  },
  {
    code: 'tempier',
    data: {
      nom: 'Domaine Tempier',
      domaine: 'Bandol',
      region: 'Provence',
      certification: 'Bio',
      notes: 'Reperes du rose de gastronomie.',
    },
  },
  {
    code: 'foillard',
    data: {
      nom: 'Jean Foillard',
      domaine: 'Morgon',
      region: 'Beaujolais',
      certification: null,
      notes: 'Gamay de vieilles vignes a maceration carbonique',
    },
  },
  {
    code: 'mogador',
    data: {
      nom: 'Clos Mogador',
      domaine: 'Priorat',
      region: 'Catalogne',
      certification: null,
      notes: 'Assemblage grenache carignan concentré.',
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
  {
    code: 'barolo_cannubi',
    data: {
      nom: 'Barolo Cannubi',
      type: 'ROUGE',
      millesime: 2016,
      region: 'Piemont',
      pays: 'Italie',
      producteurCode: 'scavino',
      fournisseurCode: 'maison',
      emplacementCode: 'reserve',
      emplacement_precision: 'Casier Italie',
      notes: 'Nebbiolo structure sur Cannubi, tanins fondus.',
      stock: 8,
      prix_moyen: 130.0,
      potentiel_garde: '2024-2035',
      derniere_mise_a_jour: '2024-09-01T10:00:00',
    },
    tags: ['grand_cru', 'collection'],
  },
  {
    code: 'rioja_reserva',
    data: {
      nom: 'Rioja Reserva Vina Tondonia',
      type: 'ROUGE',
      millesime: 2012,
      region: 'Rioja',
      pays: 'Espagne',
      producteurCode: 'lopez',
      fournisseurCode: 'cavistes',
      emplacementCode: 'cave',
      emplacement_precision: 'Rangee C - Case 2',
      notes: 'Tempranillo longuement eleve en foudre.',
      stock: 10,
      prix_moyen: 52.0,
      potentiel_garde: '2023-2032',
      derniere_mise_a_jour: '2024-07-15T12:00:00',
    },
    tags: ['gastronomie', 'degustation'],
  },
  {
    code: 'brunello_montalcino',
    data: {
      nom: 'Brunello di Montalcino',
      type: 'ROUGE',
      millesime: 2017,
      region: 'Toscane',
      pays: 'Italie',
      producteurCode: 'banfi',
      fournisseurCode: 'maison',
      emplacementCode: 'cave',
      emplacement_precision: 'Rangee D - Case 1',
      notes: 'Sangiovese classique, boise integre.',
      stock: 9,
      prix_moyen: 75.0,
      potentiel_garde: '2025-2035',
      derniere_mise_a_jour: '2024-08-12T11:30:00',
    },
    tags: ['gastronomie', 'allocation'],
  },
  {
    code: 'riesling_grand_cru',
    data: {
      nom: 'Riesling Clos Sainte Hune',
      type: 'BLANC',
      millesime: 2020,
      region: 'Alsace',
      pays: 'France',
      producteurCode: 'trimbach',
      fournisseurCode: 'primeurs',
      emplacementCode: 'reserve',
      emplacement_precision: 'Sur clayette bois',
      notes: 'Riesling sec cristallin, grande garde.',
      stock: 6,
      prix_moyen: 180.0,
      potentiel_garde: '2028-2040',
      derniere_mise_a_jour: '2024-09-18T09:45:00',
    },
    tags: ['grand_cru', 'collection'],
  },
  {
    code: 'sonoma_chardonnay',
    data: {
      nom: 'Chardonnay Sonoma Coast',
      type: 'BLANC',
      millesime: 2021,
      region: 'Californie',
      pays: 'Etats-Unis',
      producteurCode: 'kistler',
      fournisseurCode: 'cavistes',
      emplacementCode: 'armoire',
      emplacement_precision: 'Niveau superieur',
      notes: 'Chardonnay boise mais tendu, style cote californien.',
      stock: 6,
      prix_moyen: 95.0,
      potentiel_garde: '2024-2030',
      derniere_mise_a_jour: '2024-10-02T08:15:00',
    },
    tags: ['degustation', 'gastronomie'],
  },
  {
    code: 'champagne_blanc_blancs',
    data: {
      nom: 'Champagne Blanc de Blancs Extra Brut',
      type: 'EFFERVESCENT',
      millesime: 2014,
      region: 'Champagne',
      pays: 'France',
      producteurCode: 'selosse',
      fournisseurCode: 'cavistes',
      emplacementCode: 'reserve',
      emplacement_precision: 'Casier magnums',
      notes: 'Chardonnay pur, faible dosage, notes oxydatives maitrisees.',
      stock: 5,
      prix_moyen: 280.0,
      potentiel_garde: '2024-2034',
      derniere_mise_a_jour: '2024-09-25T16:40:00',
    },
    tags: ['grand_cru', 'collection', 'allocation'],
  },
  {
    code: 'porto_vintage_2011',
    data: {
      nom: 'Porto Vintage 2011',
      type: 'LIQUOREUX',
      millesime: 2011,
      region: 'Douro',
      pays: 'Portugal',
      producteurCode: 'graham',
      fournisseurCode: 'maison',
      emplacementCode: 'cave',
      emplacement_precision: 'Bas de casier',
      notes: 'Porto vintage riche en fruits noirs.',
      stock: 4,
      prix_moyen: 110.0,
      potentiel_garde: '2030-2045',
      derniere_mise_a_jour: '2024-08-28T18:00:00',
    },
    tags: ['collection', 'degustation'],
  },
  {
    code: 'bandol_rose',
    data: {
      nom: 'Bandol Rose',
      type: 'ROSE',
      millesime: 2023,
      region: 'Provence',
      pays: 'France',
      producteurCode: 'tempier',
      fournisseurCode: 'primeurs',
      emplacementCode: 'armoire',
      emplacement_precision: 'Niveau central',
      notes: 'Rose pale, mourvedre et cinsault, grande table.',
      stock: 18,
      prix_moyen: 32.0,
      potentiel_garde: '2024-2027',
      derniere_mise_a_jour: '2024-07-05T10:10:00',
    },
    tags: ['degustation'],
  },
  {
    code: 'moulin_a_vent',
    data: {
      nom: 'Moulin-a-Vent Vieilles Vignes',
      type: 'ROUGE',
      millesime: 2020,
      region: 'Beaujolais',
      pays: 'France',
      producteurCode: 'foillard',
      fournisseurCode: 'cavistes',
      emplacementCode: 'cave',
      emplacement_precision: 'Rangee E - Case 2',
      notes: 'Gamay pur, fruits rouges croquants, tanins fins.',
      stock: 15,
      prix_moyen: 38.0,
      potentiel_garde: '2024-2029',
      derniere_mise_a_jour: '2024-06-21T15:55:00',
    },
    tags: ['degustation', 'gastronomie'],
  },
  {
    code: 'priorat_finca_dofi',
    data: {
      nom: 'Priorat Finca Dofi',
      type: 'ROUGE',
      millesime: 2018,
      region: 'Priorat',
      pays: 'Espagne',
      producteurCode: 'mogador',
      fournisseurCode: 'maison',
      emplacementCode: 'reserve',
      emplacement_precision: 'Casier Sud',
      notes: 'Grenache et carignan concentres, bouche veloutee.',
      stock: 7,
      prix_moyen: 89.0,
      potentiel_garde: '2025-2035',
      derniere_mise_a_jour: '2024-10-08T13:20:00',
    },
    tags: ['collection', 'gastronomie'],
  },
];

function addGeneratedVinSeed(targetCount = 200) {
  const types = ['ROUGE', 'BLANC', 'ROSE', 'EFFERVESCENT', 'LIQUOREUX'];
  const regions = ['Bordeaux', 'Bourgogne', 'Rhone', 'Loire', 'Piemont', 'Rioja', 'Toscane', 'Californie', 'Champagne', 'Beaujolais', 'Provence'];
  const producteurs = ['leflaive', 'margaux', 'vacheron', 'scavino', 'lopez', 'banfi', 'trimbach', 'kistler', 'selosse', 'graham', 'tempier', 'foillard', 'mogador'];
  const fournisseurs = ['maison', 'cavistes', 'primeurs'];
  const emplacements = ['cave', 'armoire', 'reserve'];
  const tagSets = [
    ['grand_cru', 'collection'],
    ['gastronomie', 'degustation'],
    ['collection', 'allocation'],
    ['grand_cru', 'gastronomie'],
    ['degustation'],
    ['gastronomie'],
  ];

  let index = 1;
  while (vinSeed.length < targetCount) {
    const type = types[index % types.length];
    const region = regions[index % regions.length];
    const millesime = 2005 + ((index * 3) % 19); // between 2005 and 2023
    const producteurCode = producteurs[index % producteurs.length];
    const fournisseurCode = fournisseurs[index % fournisseurs.length];
    const emplacementCode = emplacements[index % emplacements.length];
    const prix = 20 + (index % 15) * 10;
    const stock = 3 + (index % 12);
    const potentialStart = millesime + 2;
    const potentialEnd = millesime + 12;
    const code = `gen_${index}`;

    vinSeed.push({
      code,
      data: {
        nom: `${region} Cuvee ${index}`,
        type,
        millesime,
        region,
        pays: region === 'Californie' ? 'Etats-Unis' : region === 'Rioja' || region === 'Priorat' ? 'Espagne' : region === 'Piemont' || region === 'Toscane' ? 'Italie' : 'France',
        producteurCode,
        fournisseurCode,
        emplacementCode,
        emplacement_precision: `Case ${((index - 1) % 5) + 1}`,
        notes: `Lot ${index} - style ${type.toLowerCase()} ${region}`,
        stock,
        prix_moyen: prix,
        potentiel_garde: `${potentialStart}-${potentialEnd}`,
        derniere_mise_a_jour: '2024-10-01T12:00:00',
      },
      tags: tagSets[index % tagSets.length],
    });

    index += 1;
  }
}

addGeneratedVinSeed();

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
  {
    vinCode: 'barolo_cannubi',
    type: 'ENTREE',
    quantite: 8,
    date: '2024-09-05T09:00:00',
    commentaire: 'Livraison import Italie',
    fournisseurCode: 'maison',
    emplacementCode: 'reserve',
  },
  {
    vinCode: 'rioja_reserva',
    type: 'ENTREE',
    quantite: 10,
    date: '2024-07-20T14:15:00',
    commentaire: 'Arrivee Rioja longue garde',
    fournisseurCode: 'cavistes',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'rioja_reserva',
    type: 'SORTIE',
    quantite: 2,
    date: '2024-09-10T19:00:00',
    commentaire: 'Degustation tapas',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'brunello_montalcino',
    type: 'ENTREE',
    quantite: 9,
    date: '2024-08-15T10:45:00',
    commentaire: 'Livraison primeurs Toscane',
    fournisseurCode: 'maison',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'riesling_grand_cru',
    type: 'ENTREE',
    quantite: 6,
    date: '2024-09-18T10:00:00',
    commentaire: 'Allocation Clos Sainte Hune',
    fournisseurCode: 'primeurs',
    emplacementCode: 'reserve',
  },
  {
    vinCode: 'sonoma_chardonnay',
    type: 'ENTREE',
    quantite: 6,
    date: '2024-10-02T09:30:00',
    commentaire: 'Arrivee caisse US',
    fournisseurCode: 'cavistes',
    emplacementCode: 'armoire',
  },
  {
    vinCode: 'sonoma_chardonnay',
    type: 'SORTIE',
    quantite: 1,
    date: '2024-10-15T20:00:00',
    commentaire: 'Diner poissons',
    emplacementCode: 'armoire',
  },
  {
    vinCode: 'champagne_blanc_blancs',
    type: 'ENTREE',
    quantite: 5,
    date: '2024-09-25T16:45:00',
    commentaire: 'Reception club des bulles',
    fournisseurCode: 'cavistes',
    emplacementCode: 'reserve',
  },
  {
    vinCode: 'champagne_blanc_blancs',
    type: 'SORTIE',
    quantite: 1,
    date: '2024-12-31T22:00:00',
    commentaire: 'Reveillon',
    emplacementCode: 'reserve',
  },
  {
    vinCode: 'porto_vintage_2011',
    type: 'ENTREE',
    quantite: 4,
    date: '2024-08-28T18:10:00',
    commentaire: 'Arrivee maison du vin',
    fournisseurCode: 'maison',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'bandol_rose',
    type: 'ENTREE',
    quantite: 18,
    date: '2024-07-05T10:15:00',
    commentaire: 'Arrivee ete',
    fournisseurCode: 'primeurs',
    emplacementCode: 'armoire',
  },
  {
    vinCode: 'bandol_rose',
    type: 'SORTIE',
    quantite: 3,
    date: '2024-08-20T19:30:00',
    commentaire: 'Barbecue',
    emplacementCode: 'armoire',
  },
  {
    vinCode: 'moulin_a_vent',
    type: 'ENTREE',
    quantite: 15,
    date: '2024-06-21T16:05:00',
    commentaire: 'Arrivee beaujolais',
    fournisseurCode: 'cavistes',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'moulin_a_vent',
    type: 'SORTIE',
    quantite: 2,
    date: '2024-09-30T20:15:00',
    commentaire: 'Charcuteries entre amis',
    emplacementCode: 'cave',
  },
  {
    vinCode: 'priorat_finca_dofi',
    type: 'ENTREE',
    quantite: 7,
    date: '2024-10-08T13:30:00',
    commentaire: 'Livraison Espagne',
    fournisseurCode: 'maison',
    emplacementCode: 'reserve',
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
