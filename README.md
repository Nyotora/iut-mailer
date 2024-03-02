# API de Gestion de Films (Mailer)

Cette API vous permet de gérer une liste de films, d'ajouter des films à vos favoris, de les supprimer si vous le souhaitez, et bien plus encore. Voici un aperçu des fonctionnalités principales :

## Fonctionnalités Principales

L'API de gestion de films offre les fonctionnalités suivantes :

### Gestion des Utilisateurs
- Inscription des utilisateurs avec nom, prénom, pseudo, mail et mot de passe.
- Attribuer un rôle (scope) à chaque utilisateur : "user" ou "admin".
- Les administrateurs peuvent modifier le rôle des utilisateurs.
- Seuls les administrateurs peuvent gérer les utilisateurs : création, modification, suppression.
- Les utilisateurs peuvent ajouter ou supprimer des films de leurs favoris.

### Gestion des Films
- Ajout, modification et suppression de films par les administrateurs.
- Consultation de la liste des films disponibles par tous les utilisateurs.
- Chaque film est caractérisé par un titre, un réalisateur, une description et une date de sortie.

### Notifications par Mail
- Envoi d'un mail de bienvenue lors de l'inscription d'un nouvel utilisateur.
- Notification par mail des utilisateurs lors de l'ajout ou de la modification d'un film présent dans leurs favoris.
- Export CSV des films sur demande des administrateurs, envoyé en pièce jointe par mail.

### Sécurité
- Cryptage des mots de passe des utilisateurs avant stockage en base de données.
- Authentification requise pour les opérations sensibles, avec gestion des rôles (scopes).
- Protection des routes sensibles contre les accès non autorisés.

## Comment Utiliser l'API

### Installation (1)

- Clonez le projet suivant : https://github.com/Nyotora/iut-project
- Exécutez la commande suivante pour démarrer RabbitMQ :

```bash
docker run -p 5672:5672 -p 15672:15672 -d --name "rabbitmq" rabbitmq
```

- Exécutez la commande suivante pour démarrer MySQL avec une base de données pré-créée nommée "films" :

```bash
docker run --name hapi-mysql -e MYSQL_USER=user -e MYSQL_PASSWORD=hapi -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -d -p 3308:3306 mysql:8 mysqld --default-authentication-plugin=mysql_native_password
```

- Installez les dépendances Node.js :

```bash
npm install
```

- Démarrez le serveur backend :

```bash
npm start
```

### Installation (2)

- Installez ce projet contenant le mailer
- Installez y les dépendances Node.js nécessaires :

```bash
npm install
```

- Mettez à jour les paramètres du transporter dans `index.js` afin d'assurer le bon fonctionnement du mailer :
```javascript
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "UTILISATEUR",
        pass: "MOT_DE_PASSE",
    },
});
```

- Exécutez le fichier `index.js`

### Utiliser l'API

- Vous pouvez utiliser l'API via http://localhost:3000

### Identifiants administrateur :

- Email: root@gmail.com
- Mot de passe: password


