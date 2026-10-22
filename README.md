# Comète Filante

Un jeu d'arcade dans le navigateur : tu pilotes une fusée, tu tires sur les extraterrestres, tu attrapes les étoiles et tu esquives les astéroïdes.

## Liens

- **Jouer en ligne :** https://baptistecesari-afk.github.io/comete-filante/
- **Jouer sur Vercel (avec le classement mondial) :** https://comete-filante.vercel.app
- **Code du jeu :** [index.html](index.html) (tout le jeu tient dans ce fichier : HTML, CSS et JavaScript)

Tu peux aussi télécharger `index.html` et l'ouvrir dans ton navigateur.

## Histoire

An 2187. L'Empereur Zorg a volé les étoiles de la galaxie et placé 10 gardiens dans 10 secteurs de l'espace. Ta fusée est la dernière à pouvoir décoller : traverse les secteurs, bats les gardiens et rallume le ciel. Mais Zorg n'était qu'un serviteur : derrière lui, quatre royaumes mènent jusqu'au Néant, où dort le Dévoreur d'étoiles.

## Ce qu'il y a dans le jeu

- Un prologue pour chacun des 5 mondes, qui se joue la première fois que tu y entres (et qu'on peut revoir avec « Histoire »).

- Un prologue, **5 mondes** de 10 secteurs chacun, une cinématique à l'arrivée de chaque boss, une histoire à chaque nouveau monde et un épilogue après le Dévoreur d'étoiles.
- Battre le 10e boss d'un monde ouvre le suivant pour toujours : on peut ensuite choisir son monde de départ dans le menu.

- Le **Hangar** : 15 modèles de vaisseau (dont la Fusée 8-bit et le Rétro Arcade en pixel art) (+ 2 vaisseaux de trophée), chacun avec sa cinématique de départ, 25 couleurs, couleur secondaire, motif peint, hublot, flamme, traînée, couleur des tirs, pistolet et super-pouvoir, 3 emplacements « Mes styles » et un bouton « Style au hasard ». Plus les **compétences** (chargeur, recharge, dégâts, vies…).
- 8 pistolets avec chargeur limité, et la **recharge parfaite** qui donne des balles dorées.
- 14 super-pouvoirs, de l'Hyperpropulsion au Gel cosmique.
- 50 espèces d'aliens, 10 par monde, avec 7 façons d'attaquer (poursuite, tirs, charge, division, téléportation, visée, mines).
- Un **classement mondial** sans e-mail (fonction Vercel `api/scores.js` et base Upstash Redis).
- 50 boss différents, un tous les 3 niveaux, chacun avec son dessin et ses attaques :
  - **Voie lactée** : Vaisseau-mère, Reine Gluante, Œil Suprême, Crabe Cosmique, Méduse Ionique, Pieuvre Noire, Le Spectre, Forteresse Mécanique, Dragon Stellaire et Empereur Zorg.
  - **Royaume de Givre** : Pingouin Blindé, Yéti des Comètes, Flocon Géant, Morse Spatial, Golem de Glace, Hibou des Neiges, Serpent de Givre, Sorcière Blizzard, Mammouth Cosmique et Impératrice Glacia.
  - **Forge Volcanique** : Salamandre de Lave, Golem de Magma, Phénix, Ver des Cendres, Forgeron Cyclope, Scorpion de Braise, Chauve-souris Infernale, Volcan Vivant, Hydre à Trois Têtes et Seigneur Magmor.
  - **Jungle Cosmique** : Fleur Carnivore, Mante Stellaire, Champignon Spore, Araignée Tisseuse, Caméléon Fantôme, Scarabée Cuirassé, Liane Géante, Grenouille Cosmique, L'Essaim et Reine-Ruche.
  - **Le Néant** : Sentinelle du Vide, Miroir Noir, Horloge Brisée, Glitch, Gardien Prisme, Ombres Jumelles, Trou Noir Vivant, L'Architecte, Œil du Néant et Le Dévoreur d'étoiles.
- Une caisse de tirs illimités tous les 2 niveaux.
- 24 **trophées** en 5 collections (Collection de gardiens, Chasseur d'aliens, Attrape-étoiles, Pilote, Exploits), avec médailles bronze, argent, or et diamant. Ils donnent des points bonus, des titres à afficher sous le nom de ta fusée et des récompenses exclusives : 4 super-pouvoirs ultimes, des couleurs spéciales, des couleurs de tirs, des flammes et 2 vaisseaux de légende (Prédateur et Légende).

## Commandes

| Action | Clavier / souris | Téléphone |
|---|---|---|
| Bouger | Souris, flèches ou ZQSD | Glisser le doigt |
| Tirer | Clic gauche ou F | Bouton Tir |
| Recharger | R | Toucher la jauge de munitions |
| Super-pouvoir | Espace | Bouton en bas à droite |
| Pause | P ou Échap | Bouton pause |

Un seul fichier HTML, sans installation ni dépendance.
