# Portfolio Airtable

This is a [Next.js](https://nextjs.org) project that integrates with Airtable to create a portfolio application.

## Équipe (Team Members)

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
   git clone [URL_DU_REPO]
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

## Informations Supplémentaires

- Le projet utilise Turbopack pour un développement plus rapide
- La structure du projet suit l'architecture App Router de Next.js
- Les données sont stockées et gérées via Airtable

## Ressources Utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Airtable API](https://airtable.com/developers/web/api/introduction)
- [Documentation NextAuth.js](https://next-auth.js.org/)
