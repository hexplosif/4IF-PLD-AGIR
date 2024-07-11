# CGI-AGIR-INSA

## Présentation du projet
Ce projet open-source est la réalisation d'un groupe de 6 élèves INSAliens:

Thibaud Chantrel, Sarah Pignol, Meije Pigeonnat, Gregoire Muller, Jade Le Roux, Lou Delcourt

Il s'agit de la digitalisation du jeu de carte *1 Tonnes de bonnes pratiques Green IT* créé par CGI.

La partie Backend tourne avec [NestJS](https://docs.nestjs.com/) avec l'utilisation de [Socket.io](https://socket.io/) pour la gestion des Sockets

La partie front utilise la librairie [React](https://fr.react.dev/) 

## Démarrer le projet
### Pré-requis
- Avoir Node.js an npm d'installé sur votre machine
- Avoir PostgreSQL

### Installation
1. Créer une base de donnée PostgreSQL
2. Cloner le repository
```bash
git clone https://github.com/sarahpgl/smartcgi
```
3. Installer les dépendances
```bash
npm i
```

### Configuration
Dans `workspaces/api` créer un fichier `.env` avec le contenu suivant:
```typescript
DATABASE_USER = <database_user>
DATABASE_PASSWORD = <database_password>
DATABASE_HOST = localhost
DATABASE_PORT = 5432
DATABASE_URL = <database_name>

CORS_ALLOW_ORIGIN = http://localhost:5173
```

Dans `workspaces/front` créer un fichier `.env` avec le contenu suivant:
```typescript
VITE_API_URL = http://localhost:3000
```
### Remplir la base des données
Créer deux requêtes post sur un outil REST (ex: PostMan) vers
- http://localhost:3000/sensibilisation/csv avec le fichier dataQuizz.csv dans le body
- http://localhost:3000/card/csv avec le fichier dataCard.csv dans le body
Les fichiers sont situer dans le dossier \workspaces\api\src

### Lancer l'application
1. Lancer le serveur
```bash
npm run server
```
2. Lancer le client
```bash
npm run client
```
3. Vous pouvez désormais accéder à l'application sur `http://localhost:5173`
> [!TIP]
> Pour lancer une partie il faut utiliser plusieurs naviguateurs différents. 1 pour chaque client dans la partie

## Participer au projet

### Ressources
- [FIGMA CGI x INSA](https://www.figma.com/file/FbPY4oHhFLRzVgqEGvccqo/AGIR?type=design&mode=design)  
- [SMART DRIVE](https://drive.google.com/drive/folders/1OWyNMogHzwoZg-r0Hdf1AWiKTOXT7I-G?usp=drive_link) 

### Fonctionnalités
- [x] Créer un utilisateur
- [x] Se connecter
- [x] Créer et rejoindre un lobby
- [x] Lancer une partie
- [x] Jouer une carte (Bonne pratique, Mauvaise pratique, Expert, Formation)
- [x] Quizz de bonne pratiques
- [x] Quizz de sensibilisation
- [x] Défausser une carte
- [x] Visualiser les règles du jeu
- [x] Utiliser les points de sensibilisation pour influencer la pioche
- [ ] Enregistrer les parties dans la BD
- [ ] Carnet Green IT (Composant Front OK)
- [ ] Visualiser l'ensemble des cartes (Composant Front OK)
- [ ] Gestion de rôles et de privilèges



## Licence
Ce projet est sous licence MIT. Voir le fichier [Licence](LICENSE) pour plus de détail
