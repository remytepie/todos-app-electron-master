# Vinum - Gestion de cave Electron + Vue + Prisma

Application de bureau Electron (Vue 3 + Vite) pour piloter une cave : gestion des vins, mouvements de stock, fournisseurs et emplacements, avec persistance MySQL/MariaDB via Prisma.

## Prerequis

- Node.js 18+
- MySQL ou MariaDB 10.6+
- Git

## Installation et configuration

1) Cloner le projet  
```bash
git clone <votre_repo> todos-app-electron
cd todos-app-electron
```

2) Creer la base de donnees  
```sql
CREATE DATABASE cave_vins2;
```

3) Charger le schema + donnees de demo (option SQL directe)  
```bash
mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql
```

4) Configurer l'environnement  
Creer `.env` a la racine si besoin :
```env
DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"
```
Adaptez user/mot de passe/hote/port si necessaire.

5) Installer les dependances  
```bash
npm install
```

6) Generer le client Prisma  
```bash
npx prisma generate --schema src/main/repositories/prisma/schema.prisma
```

7) (Option) Reseed via Prisma  
```bash
npm run seed
```

8) Demarrer l'application  
```bash
npm start
```
Electron Forge lance l'app, Vite sert le renderer, la fenetre s'ouvre en mode dev avec DevTools.

## Structure du projet

```
.
├─ src/
│  ├─ main/                      # Processus principal Electron
│  │  ├─ main.ts                 # Boot + DevTools + preload
│  │  ├─ registerRepositories.ts # Injection des repos IPC
│  │  └─ repositories/           # Acces DB (Prisma)
│  │     ├─ prisma/
│  │     │  ├─ schema.prisma     # Schema Prisma (wine + todos legacy)
│  │     │  └─ script/script.sql # SQL complet + seed de demo
│  │     ├─ vinRepository.ts
│  │     ├─ mouvementRepository.ts
│  │     ├─ fournisseurRepository.ts
│  │     └─ emplacementRepository.ts
│  ├─ preload/                   # Bridge IPC -> window.electronService
│  ├─ renderer/                  # UI Vue 3
│  │  ├─ App.vue                 # Shell + selection role (user/admin)
│  │  ├─ pages/                  # Vins, details, mouvements, admin
│  │  ├─ components/             # Formulaires + listes
│  │  └─ services/               # Stores/composables (auth, vins, mouvements...)
│  └─ shared/                    # Types partages renderer/main
├─ prisma/schema.prisma          # Copie du schema (sortie client genere)
├─ seed.js                       # Seed Prisma (vins + todos legacy)
├─ package.json                  # Scripts Electron Forge + lint
└─ forge.config.ts               # Config Forge + plugins Vite
```

## Fonctionnalites principales

1. Catalogue de vins : creation/edition/suppression, tags, millesime, potentiel de garde, notes, emplacement, fournisseur.
2. Mouvements de stock : entrees/sorties datees, commentaires, lien fournisseur/emplacement, recalcul du stock.
3. Emplacements et fournisseurs : creation et edition en mode Admin (page Administration).
4. Vue details vin : mise a jour infos generales + emplacement, historique des mouvements, fenetre de maturite calculee.
5. Modes User/Admin : bascule dans la sidebar, protections UI + assertions admin dans les stores.
6. Seeds de demo : script SQL complet ou `npm run seed` pour charger vins, mouvements, tags, fournisseurs, emplacements.

## Commandes utiles

```bash
npm start          # Lancer l'app en dev (Electron Forge + Vite)
npm run seed       # Peupler la base via Prisma (seed.js)
npm run lint       # Lint TypeScript
npm run package    # Builder les artefacts (Forge)
npm run make       # Generer les installateurs/archives (Forge)
```

Client Prisma :
```bash
npx prisma generate --schema src/main/repositories/prisma/schema.prisma
```

Base MySQL/MariaDB :
```bash
mysql -u root -p
USE cave_vins2;
SHOW TABLES;
```

## Problemes courants

- Prisma "Can't reach database server" : verifier MySQL lance, l'URL dans `.env`, les droits reseau/port.
- Tables absentes : rejouer `script.sql` ou `npm run seed`.
- Client Prisma manquant : `npx prisma generate --schema src/main/repositories/prisma/schema.prisma`.
- Dependances Electron/Vite corrompues :
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npx prisma generate --schema src/main/repositories/prisma/schema.prisma
  npm start
  ```

## Auteur

Remy — Application de gestion de cave sous licence MIT.
