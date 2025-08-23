# Enquête Policière – Projet IA M1 IG G1

## Description

Ce projet est un **système expert d’enquête policière** développé en **Prolog** avec une interface web moderne et un mode **console interactif**. Il permet d’analyser des suspects en fonction des preuves et des faits disponibles et de déterminer leur **culpabilité** pour différents types de crimes.

L’interface web a été **gamifiée dans un style film/fiction**, pour rendre l’expérience utilisateur immersive et engageante. La version console permet de tester le projet directement depuis le terminal, idéale pour les environnements légers ou pour un usage rapide.

Le projet a été réalisé par le **Groupe 4 – M1 IG G1**.

---

## Fonctionnalités

- Vérification de la **culpabilité** des suspects selon des règles prédéfinies :
  - Assassinat
  - Escroquerie
  - Vol
- Interface web interactive et responsive :
  - Gamifiée façon film/fiction FBI
  - Sélection de suspects et de crimes via des menus déroulants
  - Affichage dynamique des résultats
  - Indication de l’équipe responsable de l’enquête
- Version **console** pour tester directement depuis le terminal
- Serveur REST pour traitement des requêtes JSON

---

## Technologies utilisées

- **SWI-Prolog** : moteur logique pour le raisonnement expert
- **Prolog HTTP Server** : pour gérer les requêtes REST
- **HTML / CSS / JavaScript** : pour l’interface utilisateur moderne et interactive
- **FontAwesome** : pour les icônes dans l’interface

---

## Fichiers du projet

- `enquete.pl` : code Prolog contenant les faits, règles et serveur web, ainsi que le mode console
- `index.html` : interface web principale
- `css/style.css` : styles modernes et responsives
- `js/script.js` : gestion de l’interaction utilisateur et appels au serveur Prolog
- `intro.webp` : image au lancement de l'interface

---

## Installation et utilisation

1. **Installer SWI-Prolog** : [https://www.swi-prolog.org/Download.html](https://www.swi-prolog.org/Download.html)
2. Placer tous les fichiers du projet dans le même dossier

### Mode Web

3. **Lancer le serveur Prolog** :

```console
swipl -s enquete.pl -g main_web
```

Le serveur démarre sur : [http://localhost:8080](http://localhost:8080)

4. **Ouvrir l’interface web** :  
   Ouvrir `index.html` dans un navigateur moderne (Chrome, Firefox, Edge)

5. Sélectionner un **suspect** et un **crime**, puis cliquer sur **“Lancer l'analyse”** pour obtenir le résultat

---

### Mode Console

3. **Lancer le mode console** :

```console
swipl -s enquete.pl -g main
```

4. **Suivre les instructions pour entrer un suspect et un type de crime** :

```console
crime(john, vol).
```

5. **Le terminal affiche GUILTY ou NOT GUILTY.**
   Pour quitter le mode console, taper **end.**

---

## Règles de culpabilité (exemples)

- **Assassinat** : suspect avec mobile + proximité scène + (empreinte ou témoin)
- **Vol** : suspect avec mobile + proximité scène + (empreinte ou témoin)
- **Escroquerie** : suspect avec mobile et transaction bancaire ou fausse identité

---

## Équipe responsable (Groupe 4)

- Fenohery – 1187H-F
- Faratiana – 1195H-F
- Wendi – 1205H-F
- Fiderana – 1217H-F
- Tiana – 1226H-F
- Nerson – 1229H-F
- Jemima – 1244H-F
- Tsiory – 1262H-F

---

## Remarques

- Le projet est **100% local**, aucune connexion internet n’est requise pour le fonctionnement du serveur Prolog
- L’interface est **responsive et gamifiée**, inspirée du style film/fiction FBI
- Le projet peut être facilement étendu en ajoutant de nouveaux crimes, suspects ou règles de culpabilité
