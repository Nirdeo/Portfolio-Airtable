# Portfolio Airtable

C'est un projet [Next.js](https://nextjs.org) qui intègre l'API Airtable pour créer une application de portfolio.

## Équipe

- Théo DAVIGNY
- Victor DE DOMENICO
- Stéphan GUEORGUIEFF

## Technologies Utilisées

- **Frontend**:
  - Next.js 15.2.2 (avec Turbopack)
  - React 19.0.0
  - TypeScript
  - Tailwind CSS
  - Swiper (pour les carrousels)
  - React Select

- **Backend & Intégrations**:
  - Airtable API
  - NextAuth.js (authentification)
  - JWT (JSON Web Tokens)
  - bcrypt (hachage de mots de passe)

## Installation

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/Nirdeo/Portfolio-Airtable
   cd Portfolio-Airtable
   ```

2. Installez les dépendances:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:
   ```
   AIRTABLE_KEY=votre_clé_api_airtable
   AIRTABLE_BASE=votre_id_base_airtable
   JWT_SECRET=votre_secret_jwt
   ```

   Pour obtenir ces valeurs:
   - Créez un compte sur [Airtable](https://airtable.com/)
   - Créez une base de données ou utilisez une existante
   - Générez une clé API dans les paramètres de votre compte
   - Récupérez l'ID de votre base dans l'URL ou les paramètres de la base

## Lancement du Projet

1. Démarrez le serveur de développement:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

2. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Construction et Déploiement

Pour construire le projet pour la production:
```bash
npm run build
# ou
yarn build
```

Pour démarrer la version de production:
```bash
npm run start
# ou
yarn start
```

## Exécution avec Docker

Ce projet fournit une configuration Docker optimisée pour le développement, permettant un environnement de développement isolé avec rechargement à chaud.

### Configuration de Développement

- **Version Node.js utilisée** : `22.13.1-slim`
- **Port exposé** : `3000` (l'application Next.js sera accessible sur ce port)
- **Fonctionnalités de développement** :
  - Hot-reloading activé
  - Montage des volumes pour le code source
  - Node modules persistants
  - Mode développement de Next.js activé
- **Variables d'environnement requises** :
  - `AIRTABLE_KEY` : votre clé API Airtable
  - `AIRTABLE_BASE` : l'ID de votre base Airtable
  - `JWT_SECRET` : secret utilisé pour la génération des JWT
  
### Prérequis

1. Installez Docker sur votre machine
2. Créez un fichier `.env.local` à la racine du projet avec les variables d'environnement requises
3. Décommentez la ligne `env_file: ./.env.local` dans le fichier `docker-compose.yml` pour injecter les variables

### Commandes Docker via NPM

Le projet inclut des raccourcis npm pour faciliter l'utilisation de Docker :

| Commande | Description |
|----------|-------------|
| `npm run docker:up` | Démarre les conteneurs en mode interactif |
| `npm run docker:up:build` | Démarre les conteneurs après reconstruction des images |
| `npm run docker:up:detach` | Démarre les conteneurs en arrière-plan |
| `npm run docker:down` | Arrête les conteneurs |
| `npm run docker:down:orphans` | Arrête les conteneurs et supprime les conteneurs orphelins |
| `npm run docker:logs` | Affiche les logs des conteneurs en temps réel |

### Lancement en Mode Développement

1. Pour un premier lancement ou après des modifications du Dockerfile :
   ```bash
   npm run docker:up:build
   # ou directement
   docker compose up --build
   ```

2. Pour les lancements suivants (si aucune modification du Dockerfile ou des dépendances) :
   ```bash
   docker compose up
   ```
   
   > **Note** : Utilisez `docker compose up -d` pour lancer en mode détaché (background)

3. Accédez à l'application sur [http://localhost:3000](http://localhost:3000)

4. Les modifications de code seront automatiquement rechargées grâce au montage des volumes

### Commandes Docker Utiles

- Pour arrêter les conteneurs :
  ```bash
  npm run docker:down
  # ou directement
  docker compose down
  ```

- Pour voir les logs en mode détaché :
  ```bash
  npm run docker:logs
  # ou directement
  docker compose logs -f
  ```

- Pour reconstruire spécifiquement si vous modifiez les dépendances (package.json) :
  ```bash
  docker compose build
  ```

### Structure Docker

- **Dockerfile** : Configuré pour le développement avec :
  - Installation complète des dépendances
  - Commande `npm run dev` pour le serveur de développement
  - Support du hot-reloading

- **docker-compose.yml** : Configure l'environnement avec :
  - Service principal `typescript-app-dev`
  - Volumes montés pour le code source et les node_modules
  - Variables d'environnement de développement
  - Réseau Docker `appnet`

### Avantages de cette Configuration

- Environnement de développement isolé et reproductible
- Rechargement automatique des modifications de code
- Pas besoin d'installer Node.js localement
- Conservation de l'historique des node_modules dans le conteneur

## Informations Supplémentaires

- Le projet utilise Turbopack pour un développement plus rapide
- La structure du projet suit l'architecture App Router de Next.js
- Les données sont stockées et gérées via Airtable

## Ressources Utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Airtable API](https://airtable.com/developers/web/api/introduction)
- [Documentation NextAuth.js](https://next-auth.js.org/)
