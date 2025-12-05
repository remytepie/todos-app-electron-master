# Vinum - Gestion de cave Electron + Vue + Prisma

Application de bureau Electron (Vue 3 + Vite) pour piloter une cave : gestion des vins, mouvements de stock, fournisseurs et emplacements, avec MySQL/MariaDB via Prisma.

Ce guide inclut un pas-a-pas pour debutant sous Windows (PowerShell).

## Prerequis (installer d'abord)

- Node.js 18+ : https://nodejs.org (telecharger LTS, installer)
- MySQL ou MariaDB 10.6+ : https://dev.mysql.com/downloads/mysql/ ou https://mariadb.org/download/
- Git : https://git-scm.com/downloads

Verifier les versions dans PowerShell :
```powershell
node -v
npm -v
mysql --version
```

## Installation pas-a-pas

1) Cloner le projet  
```powershell
git clone <votre_repo> todos-app-electron
cd todos-app-electron
```

2) Creer la base de donnees  
Ouvrir un invite MySQL (ou Workbench/DBeaver) et executer :
```sql
CREATE DATABASE cave_vins2;
```

3) Charger le schema + donnees de demo (facile)  
- Methode simple (ligne de commande) :
```powershell
mysql -u root -p cave_vins2 < src/main/repositories/prisma/script/script.sql
```
- Methode graphique : ouvrir `src/main/repositories/prisma/script/script.sql` dans Workbench/DBeaver et executer tout.

4) Creer le fichier `.env` a la racine (meme dossier que package.json)  
Contenu minimal :
```env
DATABASE_URL="mysql://root:root@localhost:3306/cave_vins2"
```
Changez `root:root` par votre utilisateur/mot de passe si besoin.

5) Installer les dependances  
```powershell
npm install
```

6) Generer le client Prisma (necessaire pour parler a la base)  
```powershell
npx prisma generate --schema src/main/repositories/prisma/schema.prisma
```

7) (Option) Reseed via Prisma  
```powershell
npm run seed
```

8) Demarrer l'application (mode dev)  
```powershell
npm start
```
Une fenetre Electron s'ouvre, le mode dev affiche la console/DevTools.

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
│  ├─ renderer/                  # UI Vue 3 (App.vue, pages, components, services)
│  └─ shared/                    # Types partages renderer/main
├─ prisma/schema.prisma          # Copie du schema (sortie client genere)
├─ seed.js                       # Seed Prisma (vins + todos legacy)
├─ package.json                  # Scripts Electron Forge + lint
└─ forge.config.ts               # Config Forge + plugins Vite
```

## Fonctionnalites principales

1. Catalogue de vins : creation/edition/suppression, tags, millesime, potentiel de garde, notes, emplacement, fournisseur.
2. Mouvements de stock : entrees/sorties datees, commentaires, lien fournisseur/emplacement, recalcul du stock.
3. Emplacements et fournisseurs : creation et edition (page Administration).
4. Vue details vin : mise a jour infos generales + emplacement, historique des mouvements, fenetre de maturite calculee.
5. Modes User/Admin : bascule dans la sidebar, protections UI + verifs admin dans les stores.
6. Seeds de demo : script SQL complet ou `npm run seed` pour charger vins, mouvements, tags, fournisseurs, emplacements.

## Commandes utiles (PowerShell)

```powershell
npm start          # Lancer l'app en dev (Electron Forge + Vite)
npm run seed       # Peupler la base via Prisma (seed.js)
npm run lint       # Lint TypeScript
npm run package    # Builder les artefacts (Forge)
npm run make       # Generer les installateurs/archives (Forge)
```

Client Prisma :
```powershell
npx prisma generate --schema src/main/repositories/prisma/schema.prisma
```

Base MySQL/MariaDB :
```powershell
mysql -u root -p
USE cave_vins2;
SHOW TABLES;
```

## Problemes courants (et solutions rapides)

- Prisma "Can't reach database server" : verifier que MySQL tourne, que `.env` pointe vers le bon host/port/user/pass, et que `mysql -u root -p` fonctionne.
- Tables absentes : rejouer `src/main/repositories/prisma/script/script.sql` ou `npm run seed`.
- Client Prisma manquant : `npx prisma generate --schema src/main/repositories/prisma/schema.prisma`.
- Dependances corrompues :
  ```powershell
  rm -r node_modules package-lock.json
  npm install
  npx prisma generate --schema src/main/repositories/prisma/schema.prisma
  npm start
  ```
- Port MySQL occupe / service arrete : relancer le service MySQL (Services Windows) ou changer le port dans `.env` et `my.ini`.

## Auteur

Remy — Application de gestion de cave à vin.
