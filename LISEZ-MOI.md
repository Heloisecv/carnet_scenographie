# Mode d'emploi du site

## Voir le site sur ton ordinateur
Double-clique sur `index.html` : il s'ouvre dans ton navigateur.
Après chaque modification, enregistre le fichier (Cmd + S) puis recharge la page (Cmd + R).

## Où se trouve quoi

| Je veux…                                   | Fichier à ouvrir                         |
|--------------------------------------------|------------------------------------------|
| changer le **titre du projet** (partout)   | `js/script.js` → `titre:` (tout en haut) |
| changer le **statut** d'une étape          | `js/script.js` → liste `pages:`          |
| modifier un **texte** d'une page           | la page elle-même (`index.html` ou `pages/…`) |
| ajouter une **référence**                  | `contenu/references.js`                  |
| ajouter une **entrée de journal**          | `contenu/journal.js`                     |
| ajouter une **ressource** (bibliographie)  | `contenu/ressources.js`                  |
| changer une **couleur / une police**       | `css/style.css` → partie 1 « RÉGLAGES »  |
| déplacer un **objet du bureau** (accueil)  | `index.html` → `style="--x … --y … --w … --r …"` de l'objet |

Pour voir toutes les briques visuelles d'un coup, ouvre `pages/charte.html` (lien « Charte graphique » en bas de chaque page).

## Les repères dans le code
- `class="a-ecrire"` : un texte encore à rédiger (le post-it rose). Remplace tout le paragraphe par `<p>Ton texte</p>`.
- `class="emplacement"` : une photo à venir (tirage hachuré au crayon).
- `[À préciser]`, `[À coter]` : une information à compléter.
- `<!-- ✏️ … -->` : un commentaire qui explique quoi faire à cet endroit.

## Ajouter une image
1. Range la photo dans le bon dossier de `images/` (un dossier par page).
   Nom de fichier **sans accents ni espaces** : `maquette-v1-face.jpg` ✓  `Maquette V1 (face).JPG` ✗
2. Allège-la avant : largeur max ≈ 2000 px, format JPG (ou WebP), idéalement < 500 Ko.
   Sur Mac : Aperçu → Outils → Ajuster la taille.
3. Dans la page, remplace le bloc emplacement :
   ```html
   <div class="emplacement"><span>Maquette blanche V1 — vue d'ensemble</span></div>
   ```
   par :
   ```html
   <a class="zoom photo" href="../images/02-maquette-blanche/maquette-v1-face.jpg">
     <img src="../images/02-maquette-blanche/maquette-v1-face.jpg"
          alt="Maquette blanche, vue de face depuis la salle" loading="lazy">
   </a>
   ```
   - `zoom` : l'image s'agrandit au clic.
   - `photo` : le cadre blanc de tirage photo. `photo photo--polaroid` : version polaroid.
   - Pour garder le morceau de scotch, ajoute `scotch` sur la balise `<figure>` qui l'entoure.
   - `alt` : une description de l'image pour les personnes qui ne la voient pas (obligatoire).
   - `../` veut dire « remonter d'un dossier ». Dans `index.html` (qui est à la racine), on écrit `images/…` sans `../`.

## Ajouter un PDF
Range-le dans `documents/pdf/` ou `documents/plans/`, puis ajoute dans la page :
```html
<a class="action" href="../documents/pdf/mon-document.pdf" target="_blank">Ouvrir le PDF</a>
```

## Les tampons (statuts)
`explorer` (À explorer) · `en-cours` · `valider` (À valider) · `retenu` · `realise` (Réalisé) · `non-produit`
S'écrivent : `<span data-statut="en-cours"></span>`
