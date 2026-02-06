# Footbal Match Director

Un projet pour gérer des joueurs et des matchs de football.

Tout utilisateur pourra voir les matchs en cours, avec actualisation en live, les anciens matchs, les joueurs ainsi que leurs joueurs respectifs.
Il pourra aussi parier sur des matchs.

Un admin pourra lancer ou arrêter un match, ainsi qu'ajouter des buts.

## Aperçu visuel
Voici un aperçu de l'interface :

![screenshot](docs/screenshot-home.png)
![screenshot](docs/screenshot-bets.png)

## 🧩 Fonctionnalités clés

- 🔐 Authentification JWT avec rôles (admin / user)
- 📅 Gestion des matchs (CRUD, live updates)
- 👤 Gestion des joueurs et équipes
- 🎲 Système de paris sportifs (avec cotes dynamiques)
- ⚡ Notifications en temps réel (WebSocket / Redis)
- 🧠 Cache Redis pour booster les performances
- 📖 Documentation Swagger auto-générée

## Prérequis

Pour lancer le projet, vous devez avoir installé :

- Node.js dans sa version LTS (≥ 22.15.0 et < 23.X.X)
- Docker
- Yarn
- Un fichier `.env` dans `/BACK`

```bash
JWT_SECRET=super-secret-key
```

## Installation et lancement

Une fois les prérequis installés, il suffit d’exécuter cette commande **à la racine du projet** :

Cloner le dépôt ou télécharger les fichiers.

1. Se placer dans le projet
```bash
cd football-match-director
```

2. Installation des dépendances
```bash
yarn install
```

3. Démarrage de l'infrastructure et des microservices
```bash
yarn start:all
```

Cela va automatiquement :

- Lancer les conteneurs Docker (MySQL, Redis, Angular)
- Attendre que la base de données **MySQL** soit complètement prête
- Démarrer le backend **Node** situé dans `BACK/`
- Lancer le frontend **Angular**

## C'est parti !
Se rendre sur http://localhost:5173/

Le backend sera disponible sur: http://localhost:8080

Et le swagger sur : http://localhost:8080/api-docs


## Utilisateurs de test

Lors de l'initialisation automatique de la base de données (via `init.sql`), **deux utilisateurs sont créés** :

| Identifiant | Mot de passe | Rôle  |
|-------------|--------------|-------|
| `admin`     | `admin`      | admin |
| `user`      | `user`       | user  |

Ces comptes permettent de tester rapidement l'authentification et les rôles dans l'application.

Utilisez ces identifiants dans `/login` pour accéder aux pages protégées selon le rôle.

## Commandes Utiles

Les tests se lancent avec
```bash
npm test
```

Pour réinitialiser les conteneurs et les données de la base mysql et de redis :
```bash
yarn reset
```

## Initialisation automatique de la base de données

À la racine du projet, un dossier `mysql-init/` contient un fichier `init.sql` permettant d'initialiser automatiquement la base de données MySQL avec des données de base (ex : joueurs, matchs, etc.).

Ce fichier est monté automatiquement dans le conteneur MySQL via `docker-compose.yml`, et est exécuté à la première création du volume.

⚠️ Le script ne sera **réexécuté que si le volume MySQL est supprimé**.

## Configuration

La base de données MySQL est configurée dans le docker compose avec les informations suivantes :

- **Base de données** : `winamax`
- **Utilisateur** : `root`
- **Mot de passe** : `Root@1234`

Redis est configurée dans le docker compose avec les informations suivantes :

- **Host** : `127.0.0.1`
- **Port** : `6379`

## Interface Frontend (Angular)

Le projet frontend est situé dans le dossier `FRONT/`. Il est développé avec **Angular**.

- **`/login`** : Page de connexion permettant à l'utilisateur de s'authentifier (JWT).

- **`/teams`** : Liste de toutes les équipes disponibles.

- **`/teams/:id`** : Affiche les **matchs à venir et terminés** pour l’équipe avec l’identifiant `id`, ainsi que la **liste des joueurs** appartenant à cette équipe.

- **`/players`** : Liste de tous les joueurs avec une **barre de recherche** pour filtrer par nom.

- **`/players/:id`** : Détail d’un joueur : nom, position, équipe, statistiques, etc.

- **`/home`** : Affiche la liste des matchs à venir et terminés (tous clubs confondus).

- **`/match/direct`** : Permet de sélectionner un match disponible pour le suivi en direct.

- **`/match/direct/:id`** : Page de suivi **en temps réel** du match avec identifiant `id` (mise à jour via WebSocket).

- **`/odds`** : Affiche la liste des paris disponibles, et permet à l'utilisateur un match sur lequel parier

- **`/bets/:id`** : Permet de parier un montant voulu sur l'issue du match sélectionné

- **`/bets`** : Permet de visualiser tous ses paris et son portefeuille actuel

- **`/admin`** : Interface permettant à un administrateur de **publier des événements clés (comme un but)** dans un match spécifique, en temps réel.
