/* ----------------------------------------------------------------------
   Wine cellar domain tables.
---------------------------------------------------------------------- */

DROP TABLE IF EXISTS vin_tag_assignments;
DROP TABLE IF EXISTS mouvements;
DROP TABLE IF EXISTS vins;
DROP TABLE IF EXISTS vin_tags;
DROP TABLE IF EXISTS emplacements;
DROP TABLE IF EXISTS fournisseurs;
DROP TABLE IF EXISTS producteurs;

CREATE TABLE producteurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(191) NOT NULL,
    domaine VARCHAR(191),
    region VARCHAR(191),
    certification VARCHAR(191),
    notes TEXT
);

CREATE TABLE fournisseurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(191) NOT NULL,
    ville VARCHAR(191),
    contact VARCHAR(191),
    notes TEXT
);

CREATE TABLE emplacements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(191) NOT NULL,
    temperature DECIMAL(4,1),
    humidite DECIMAL(4,1),
    notes TEXT
);

CREATE TABLE vin_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL UNIQUE
);

CREATE TABLE vins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(191) NOT NULL,
    type ENUM('ROUGE','BLANC','ROSE','EFFERVESCENT','LIQUOREUX','AUTRE') NOT NULL,
    millesime INT,
    region VARCHAR(191),
    pays VARCHAR(191),
    producteur_id INT,
    fournisseur_id INT,
    emplacement_id INT,
    emplacement_precision VARCHAR(191),
    notes TEXT,
    stock INT NOT NULL DEFAULT 0,
    prix_moyen DECIMAL(10,2),
    potentiel_garde VARCHAR(191),
    derniere_mise_a_jour DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producteur_id) REFERENCES producteurs(id),
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id),
    FOREIGN KEY (emplacement_id) REFERENCES emplacements(id)
);

CREATE TABLE vin_tag_assignments (
    vin_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (vin_id, tag_id),
    FOREIGN KEY (vin_id) REFERENCES vins(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES vin_tags(id) ON DELETE CASCADE
);

CREATE TABLE mouvements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vin_id INT NOT NULL,
    type ENUM('ENTREE','SORTIE') NOT NULL,
    quantite INT NOT NULL,
    date DATETIME NOT NULL,
    commentaire TEXT,
    fournisseur_id INT,
    emplacement_id INT,
    FOREIGN KEY (vin_id) REFERENCES vins(id) ON DELETE CASCADE,
    FOREIGN KEY (fournisseur_id) REFERENCES fournisseurs(id),
    FOREIGN KEY (emplacement_id) REFERENCES emplacements(id)
);

INSERT INTO fournisseurs (nom, ville, contact, notes) VALUES
('La Maison du Vin', 'Bordeaux', 'contact@maisonduvin.fr', 'Allocations historiques.'),
('Cavistes & Co', 'Paris', 'contact@cavistes.co', 'Livraison rapide sur Paris.'),
('Primeurs Excellence', 'Lyon', 'primeurs@excellence.fr', 'Specialiste des millesimes jeunes.');

INSERT INTO emplacements (libelle, temperature, humidite, notes) VALUES
('Cave principale', 12.0, 70.0, 'Casier en pierre, hygrometrie controlee.'),
('Armoire degustation', 18.0, 60.0, 'Armoire a ouverture rapide pour les bouteilles a sortir.'),
('Reserve famille', 10.0, 75.0, 'Zone reservee aux grands formats.');

INSERT INTO vin_tags (name) VALUES
('Grand Cru'),
('Collection'),
('Gastronomie'),
('Degustation'),
('Allocation');

INSERT INTO vins (nom, type, millesime, region, pays, producteur_id, fournisseur_id, emplacement_id, emplacement_precision, notes, stock, prix_moyen, potentiel_garde, derniere_mise_a_jour) VALUES
('Puligny-Montrachet 1er Cru Les Pucelles', 'BLANC', 2018, 'Bourgogne', 'France', NULL, 1, 1, 'Rangee A - Case 1', 'Chardonnay vibrant avec une grande profondeur.', 12, 260.00, '2025-2034', '2024-05-01 10:00:00'),
('Chateau Margaux', 'ROUGE', 2015, 'Bordeaux', 'France', NULL, 2, 1, 'Rangee B - Case 3', 'Cabernet sauvignon intense, finale interminable.', 6, 690.00, '2030-2040', '2024-04-18 09:15:00'),
('Sancerre Blanc Les Romains', 'BLANC', 2022, 'Loire', 'France', NULL, 3, 2, 'Colonne 2 - Niveau haut', 'Sauvignon blanc salin et citronne.', 24, 42.00, '2024-2028', '2024-06-10 14:32:00'),
('Champagne Extra Brut', 'EFFERVESCENT', 2016, 'Champagne', 'France', NULL, 2, 3, 'Casier magnums', 'Assemblage pinot/chardonnay, dosage tres faible.', 8, 115.00, '2024-2030', '2024-07-12 11:05:00'),
('Hermitage Blanc Chante-Alouette', 'BLANC', 2020, 'Rhone', 'France', NULL, 1, 2, 'Colonne 1 - Milieu', 'Marsanne ample, bouche miel et fruits secs.', 10, 78.00, '2025-2032', '2024-08-03 16:22:00');

INSERT INTO vin_tag_assignments (vin_id, tag_id) VALUES
(1, 1),
(1, 3),
(1, 5),
(2, 1),
(2, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 4),
(5, 3),
(5, 5);

INSERT INTO mouvements (vin_id, type, quantite, date, commentaire, fournisseur_id, emplacement_id) VALUES
(1, 'ENTREE', 12, '2024-01-10 11:00:00', 'Allocation primeur', 1, 1),
(2, 'ENTREE', 6, '2024-02-05 08:30:00', 'Livraison cavistes', 2, 1),
(1, 'SORTIE', 2, '2024-03-22 19:45:00', 'Degustation club', NULL, 2),
(3, 'ENTREE', 24, '2024-04-15 10:20:00', 'Arrivee millesime 2022', 3, 2),
(4, 'ENTREE', 8, '2024-05-08 12:10:00', 'Recu du caviste', 2, 3),
(4, 'SORTIE', 2, '2024-08-30 21:00:00', 'Soiree degustation bulles', NULL, 3),
(5, 'ENTREE', 10, '2024-06-18 14:45:00', 'Livraison producteur', 1, 2),
(5, 'SORTIE', 3, '2024-09-02 19:30:00', 'Accords fromages', NULL, 2);
