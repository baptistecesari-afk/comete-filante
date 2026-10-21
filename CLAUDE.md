# Comète Filante : règles pour travailler à plusieurs

Ce jeu est fait à plusieurs : **baptistecesari-afk** (le propriétaire du dépôt), **yoanndegiovanni-rgb**, et plusieurs sessions de Claude. Pour ne jamais effacer le travail des autres, chaque session de Claude suit ces règles.

## Avant de modifier
- Toujours repartir de la **dernière version de `main`** sur GitHub (`git fetch origin main`), jamais d'une copie gardée ailleurs.
- Tout le jeu est dans **`index.html`**. C'est la seule source à modifier.

## Pour proposer un changement
- **Ne jamais pousser directement sur `main`.**
- Créer une branche à partir de `main` (par exemple `claude/nom-du-changement`), y faire **un seul changement à la fois**, puis ouvrir une **pull request** vers `main`.
- Écrire dans la pull request, en français simple, ce qui change pour le joueur et comment ça a été testé.
- Ce sont les humains (baptistecesari-afk ou yoanndegiovanni-rgb) qui acceptent la pull request.

## Si `main` a changé pendant le travail
- Récupérer la nouvelle version (`git fetch origin main`), puis remettre sa branche à jour (`git rebase origin/main`) et régler les conflits **en gardant les deux changements**.
- Ne jamais forcer un envoi qui effacerait le travail de quelqu'un d'autre.

## Tester avant de proposer
- Ouvrir `index.html` dans un navigateur, jouer une partie et vérifier qu'il n'y a pas d'erreur dans la console.
- Vérifier aussi l'affichage sur une largeur de téléphone (environ 400 px).
