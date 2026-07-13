# MyCookBook

MyCookBook est une application web de partage de recettes. Elle permet de consulter et rechercher des recettes, puis, après authentification, de gérer ses propres recettes, ses favoris, ses notes, ses commentaires et son profil.

Le dépôt contient deux applications distinctes :

- `frontend/` : interface React construite avec Vite ;
- `backend/` : API REST Express connectée à MongoDB avec Mongoose.

## Fonctionnalités disponibles

- inscription, connexion et déconnexion ;
- authentification par jetons JWT stockés dans des cookies HTTP-only ;
- renouvellement automatique du jeton d'accès avec un refresh token ;
- consultation de toutes les recettes et de leur détail ;
- recherche multicritère de recettes ;
- ajout, modification et suppression de ses propres recettes ;
- envoi d'une image pour une recette ;
- ajout et suppression de favoris ;
- notation des recettes ;
- ajout, modification et suppression de commentaires ;
- consultation, modification et suppression du profil utilisateur.

## Technologies

### Frontend

- React 18 et React DOM ;
- Vite 6 ;
- React Router ;
- Zustand pour l'état d'authentification ;
- Formik et Yup pour les formulaires et leur validation ;
- React Toastify, React Modal, Font Awesome et React Tooltip.

### Backend

- Node.js et Express 4 ;
- MongoDB et Mongoose ;
- JSON Web Tokens, cookies et bcryptjs ;
- Multer pour l'envoi des images ;
- dotenv et CORS.

## Prérequis

- Node.js et npm ;
- une instance MongoDB locale accessible sur `mongodb://localhost:27017`.

Le projet utilise actuellement des adresses locales codées dans l'application :

- interface : `http://localhost:5173` ;
- API : `http://localhost:8080` ;
- base MongoDB : `mongodb://localhost:27017/mycookbook`.

## Installation

Installez séparément les dépendances du backend et du frontend depuis la racine du dépôt :

```bash
cd backend
npm install

cd ../frontend
npm install
```

Créez ensuite un fichier `backend/.env` contenant les deux secrets utilisés pour signer les jetons :

```dotenv
JWT_SECRET=remplacez_par_un_secret_robuste
REFRESH_TOKEN_SECRET=remplacez_par_un_autre_secret_robuste
```

Ne versionnez pas ces valeurs réelles.

## Lancement en développement

Assurez-vous que MongoDB est démarré, puis ouvrez deux terminaux.

Backend :

```bash
cd backend
npm run dev
```

Frontend :

```bash
cd frontend
npm run dev
```

Ouvrez ensuite `http://localhost:5173`.

Le backend peut aussi être lancé sans rechargement automatique avec `npm start`.

## Scripts disponibles

Dans `frontend/` :

| Commande | Description |
| --- | --- |
| `npm run dev` | démarre le serveur Vite de développement |
| `npm run build` | génère la version de production dans `frontend/dist/` |
| `npm run preview` | sert localement la version compilée |
| `npm run lint` | analyse le code frontend avec ESLint |

Dans `backend/` :

| Commande | Description |
| --- | --- |
| `npm run dev` | démarre l'API avec Nodemon |
| `npm start` | démarre l'API avec Node.js |

Le dépôt ne contient actuellement aucune suite de tests automatisés. Le script `npm test` du backend est uniquement le script placeholder généré par npm et se termine en erreur.

## Routes de l'interface

Les pages publiques sont l'accueil (`/`), la recherche (`/search`), l'inscription (`/register`) et la connexion (`/login`). Les pages `/my-recipes`, `/my-favorites` et `/profile` sont protégées. La déconnexion est disponible sur `/logout`.

## API REST

L'API est exposée directement sur `http://localhost:8080`.

| Domaine | Routes principales |
| --- | --- |
| Authentification | `POST /register`, `POST /login`, `POST /refresh-token`, `POST /logout` |
| Profil | `GET /get-profile`, `PUT /update-profile`, `DELETE /delete-profile` |
| Recettes | `GET /recipes`, `GET /recipes/:id`, `GET /user-recipes`, `POST /add-recipe`, `PUT /recipes/:id`, `DELETE /recipes/:id`, `POST /search-recipes` |
| Favoris | `GET /favorites`, `POST /add-favorite`, `DELETE /delete-favorite` |
| Notes | `GET /ratings`, `POST /add-rating` |
| Commentaires | `GET /comments/recipe/:recipeId`, `POST /comments`, `PUT /comments/:commentId`, `DELETE /comments/:commentId` |

Les opérations liées au profil, aux recettes personnelles, aux favoris, à l'ajout d'une note et à la modification des commentaires nécessitent une authentification. Les formulaires de création et de modification d'une recette utilisent `multipart/form-data` avec un champ fichier nommé `picture`.

Les images de recettes enregistrées par le backend sont servies sous `/img` depuis `backend/img/`.

## Structure du projet

```text
MyCookBook/
├── backend/
│   ├── config/          # connexion MongoDB
│   ├── controllers/     # logique des endpoints
│   ├── img/recipes/     # images des recettes
│   ├── middlewares/     # CORS, JWT et upload
│   ├── models/          # modèles Mongoose
│   ├── routes/          # déclaration des routes API
│   └── server.js        # point d'entrée Express
└── frontend/
    ├── public/          # catalogue et images d'ingrédients
    └── src/
        ├── api/         # appels vers l'API
        ├── components/  # pages et composants métier
        ├── layout/      # layouts public et authentifié
        ├── router/      # routes React
        ├── store/       # état Zustand
        ├── styles/      # feuilles de style
        ├── utils/       # route privée et composants utilitaires
        └── validations/ # schémas Yup
```

## Limites actuelles

- les URL du frontend, de l'API et de MongoDB ne sont pas configurables par variables d'environnement ;
- le port du backend est fixé à `8080` et l'origine CORS à `http://localhost:5173` ;
- la configuration des cookies est adaptée au développement local ; l'option `secure` prévue pour HTTPS est commentée ;
- aucune configuration Docker, donnée d'initialisation ni suite de tests automatisés n'est fournie ;
- le projet racine ne possède pas de script npm permettant de lancer les deux applications simultanément.

## CI/CD et conteneurs

La CI GitHub Actions (`.github/workflows/ci.yml`) s'exécute sur les pushes vers
`main`/`develop` et sur toutes les pull requests. Elle installe les dépendances
avec `npm ci`, contrôle le backend, analyse et compile le frontend, puis construit
les deux images Docker sans les publier.

La CD (`.github/workflows/cd.yml`) s'exécute sur `main`, sur les tags `v*` et
manuellement. Elle publie dans GitHub Container Registry :

- `ghcr.io/b3-martigues/mycookbook/backend` ;
- `ghcr.io/b3-martigues/mycookbook/frontend`.

Chaque image reçoit un tag immuable basé sur le SHA, le tag Git éventuel et
`latest` sur la branche principale. Une attestation de provenance est également
publiée. Le workflow utilise uniquement le `GITHUB_TOKEN` fourni par GitHub ;
aucun secret supplémentaire n'est nécessaire pour publier.

Pour lancer toute la stack localement, copiez les valeurs de
`backend/.env.example` dans un fichier `.env` à la racine, puis exécutez :

```bash
docker compose up --build -d
docker compose ps
```

En production, `compose.prod.yml` utilise les images déjà publiées. Le fichier
`.env` du serveur peut redéfinir `IMAGE_PREFIX` (par défaut
`ghcr.io/b3-martigues/mycookbook`) et doit définir `IMAGE_TAG`, `CORS_ORIGINS`,
`JWT_SECRET` et `REFRESH_TOKEN_SECRET`. Le serveur doit être authentifié auprès
de GHCR si le paquet est privé :

```bash
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d --remove-orphans
```

Les données MongoDB et les images envoyées sont conservées dans des volumes.
Les deux services applicatifs exposent un healthcheck. Le frontend est disponible
sur le port `5173` et l'API sur le port `8080`.

Dans l'image de production, les appels API passent par le proxy Nginx sur la même
origine. `VITE_API_URL` peut être fourni comme argument de build pour cibler une
API externe ; en développement Vite, sa valeur par défaut reste
`http://localhost:8080`.

Le workflow `Deploy production` permet ensuite de déployer un tag précis par SSH.
Créez d'abord l'environnement GitHub `production` (avec règles d'approbation si
souhaité) et les secrets suivants : `DEPLOY_HOST`, `DEPLOY_USER`,
`DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` et `DEPLOY_PATH`. Le répertoire distant
doit contenir le fichier `.env` de production décrit ci-dessus et Docker doit
déjà être authentifié auprès de GHCR. Lancez enfin le workflow manuellement en
indiquant `latest`, un tag de version ou un tag `sha-*` ; Compose télécharge les
images, recrée les services et conserve leurs volumes.
