/* =====================================================================
   SCRIPT PRINCIPAL DU SITE
   ---------------------------------------------------------------------
   Ce fichier fait 5 choses :
   1. Garde les RÉGLAGES GÉNÉRAUX (titre du site, liste des pages)
   2. Écrit le menu, le bas de page et les liens "chapitre suivant"
      sur toutes les pages → on ne les écrit qu'une seule fois ici.
   3. Fait fonctionner la visionneuse d'images (agrandissement).
   4. Fait fonctionner le curseur de comparaison avant / après.
   5. Affiche les listes rangées dans le dossier contenu/
      (références, journal, ressources).

   ✏️ Ce que tu modifieras ici : seulement la partie 1.
   ===================================================================== */


/* =====================================================================
   1. RÉGLAGES GÉNÉRAUX  ✏️
   ===================================================================== */
const SITE = {
  // Le titre du projet : change-le ici, il se met à jour partout.
  titre: "Scénographie en bazar",

  // Petite ligne affichée en bas de chaque page
  signature: "[Ton nom] — conception scénographique",

  // Les pages du parcours, dans l'ordre.
  // statut possible : "explorer", "en-cours", "valider", "retenu", "realise"
  pages: [
    { num: "00", court: "L'origine du projet", titre: "L'origine du projet",        fichier: "pages/00-origine-projet.html",        statut: "en-cours" },
    { num: "01", court: "Lire, préparer", titre: "Lire, préparer, rechercher",       fichier: "pages/01-lire-preparer.html",       statut: "en-cours" },
    { num: "02", court: "Maquette blanche", titre: "La maquette blanche",            fichier: "pages/02-maquette-blanche.html",    statut: "explorer" },
    { num: "03", court: "Dessin technique", titre: "Du volume au dessin technique",  fichier: "pages/03-dessin-technique.html",    statut: "explorer" },
    { num: "04", court: "Direction artistique", titre: "La direction artistique développée", fichier: "pages/04-direction-artistique.html", statut: "explorer" },
    { num: "05", court: "Maquettes & 3D", titre: "Maquettes matiérées et 3D",        fichier: "pages/05-maquettes-3d.html",        statut: "explorer" },
    { num: "06", court: "Carnet",         titre: "Carnet de bord et ressources",     fichier: "pages/06-carnet.html",              statut: "en-cours" },
  ],
};

// Libellés des statuts (affichés à l'écran)
const STATUTS = {
  "explorer":    "À explorer",
  "en-cours":    "En cours",
  "valider":     "À valider",
  "retenu":      "Retenu",
  "realise":     "Réalisé",
  "non-produit": "Non produit",
};


/* =====================================================================
   Ne pas modifier en dessous, sauf si tu sais ce que tu fais :)
   ===================================================================== */

// Chaque page indique où se trouve la racine du site :
// <body data-racine="."> pour index.html, <body data-racine=".."> pour les pages/
const RACINE = document.body.dataset.racine || ".";
const PAGE_ACTUELLE = document.body.dataset.page || "";
const chemin = (fichier) => `${RACINE}/${fichier}`;


/* ----- 2a. Titre du site partout où il est demandé ----------------- */
document.querySelectorAll("[data-titre-site]").forEach((el) => (el.textContent = SITE.titre));
document.title = document.title.replace("{titre}", SITE.titre);


/* ----- 2b. En-tête : les étapes sont réparties autour du titre */
const entete = document.querySelector("[data-entete]");
if (entete) {
  const lien = (p) => `
      <li><a href="${chemin(p.fichier)}" ${p.num === PAGE_ACTUELLE ? 'aria-current="page"' : ""}>
        <span class="num">${p.num}</span><span class="libelle">${p.court}</span>
      </a></li>`;
  const etapes = SITE.pages;
  const moitie = Math.floor(etapes.length / 2);

  entete.classList.add("entete");
  entete.innerHTML = `
    <div class="conteneur entete__ligne">
      <nav aria-label="Premières étapes"><ul class="menu menu--gauche">${etapes.slice(0, moitie).map(lien).join("")}</ul></nav>
      <a class="entete__titre" href="${chemin("index.html")}">${SITE.titre}</a>
      <nav aria-label="Étapes suivantes"><ul class="menu menu--droite">${etapes.slice(moitie).map(lien).join("")}</ul></nav>
      <button class="bouton-menu" aria-expanded="false" aria-controls="menu-mobile">Sommaire</button>
    </div>
    <nav class="menu-mobile" id="menu-mobile" aria-label="Sommaire">
      <span class="etiquette etiquette--cousue">Sommaire</span>
      <ol>${SITE.pages.map((p) => `<li><a href="${chemin(p.fichier)}" ${p.num === PAGE_ACTUELLE ? 'aria-current="page"' : ""}><span class="num">${p.num}</span>${p.titre}</a></li>`).join("")}</ol>
    </nav>`;

  const bouton = entete.querySelector(".bouton-menu");
  const basculer = (ouvert) => {
    entete.classList.toggle("menu-ouvert", ouvert);
    bouton.setAttribute("aria-expanded", ouvert);
    bouton.textContent = ouvert ? "Fermer" : "Sommaire";
    bouton.classList.toggle("menu-mobile__fermer", ouvert);
    bouton.style.position = ouvert ? "fixed" : "";
    bouton.style.zIndex = ouvert ? "95" : "";
    document.body.style.overflow = ouvert ? "hidden" : "";
  };
  bouton.addEventListener("click", () => basculer(!entete.classList.contains("menu-ouvert")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") basculer(false); });
}


/* ----- 2b bis. Progression à gauche (losange + un point par section)
   Toute <section class="section" id="…" data-nom="…"> y apparaît.     */
const sectionsNommees = [...document.querySelectorAll(".section[id][data-nom]")];
if (sectionsNommees.length > 1) {
  const prog = document.createElement("nav");
  prog.className = "progression";
  prog.setAttribute("aria-label", "Sections de la page");
  prog.innerHTML = `<a href="#contenu" aria-label="Haut de page"><span class="progression__losange"></span></a>` +
    sectionsNommees.map((s) => `<a href="#${s.id}"><span class="progression__point"></span><span class="progression__nom">${s.dataset.nom}</span></a>`).join("");
  document.body.appendChild(prog);
}

/* ----- 2c. Chapitre précédent / suivant + pied de page -------------- */
const pied = document.querySelector("[data-pied]");
if (pied) {
  const i = SITE.pages.findIndex((p) => p.num === PAGE_ACTUELLE);
  const prec = SITE.pages[i - 1];
  const suiv = SITE.pages[i + 1];
  const lien = (p, sens) =>
    p ? `<a href="${chemin(p.fichier)}"><span class="sens">${sens} · ${p.num}</span><span class="titre">${p.titre}</span></a>` : "<span></span>";

  pied.innerHTML = `
    <div class="conteneur">
      ${i >= 0 ? `<nav class="suite" aria-label="Chapitres">${lien(prec, "Précédent")}${lien(suiv, "Suivant")}</nav>` : ""}
      <div class="pied">
        <span>${SITE.signature}</span>
        <span><a href="${chemin("pages/charte.html")}">Charte graphique</a> · Projet étudiant, en cours</span>
      </div>
    </div>`;
}


/* ----- 2d. Statut de chaque page dans le sommaire de l'accueil ------ */
document.querySelectorAll("[data-statut-page]").forEach((el) => {
  const p = SITE.pages.find((x) => x.num === el.dataset.statutPage);
  if (p) { el.classList.add("statut", `statut--${p.statut}`); el.textContent = STATUTS[p.statut]; }
});

/* Tout élément <span data-statut="en-cours"></span> reçoit son libellé */
document.querySelectorAll("[data-statut]").forEach((el) => {
  const s = el.dataset.statut;
  el.classList.add("statut", `statut--${s}`);
  if (!el.textContent.trim()) el.textContent = STATUTS[s] || s;
});


/* ----- 2e. Progression : allume le point de la section en cours de lecture */
const liensSommaire = document.querySelectorAll(".progression a");
if (liensSommaire.length && "IntersectionObserver" in window) {
  const observateur = new IntersectionObserver((entrees) => {
    entrees.forEach((e) => {
      if (e.isIntersecting) {
        liensSommaire.forEach((a) => a.classList.toggle("actif", a.getAttribute("href") === `#${e.target.id}`));
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sectionsNommees.forEach((s) => observateur.observe(s));
}


/* =====================================================================
   3. VISIONNEUSE D'IMAGES
   Pour qu'une image s'agrandisse au clic, entoure-la d'un lien :
   <a class="zoom" href="../images/dossier/grande-image.jpg">
     <img src="../images/dossier/image.jpg" alt="Description">
   </a>
   Les images d'une même <div data-galerie> défilent ensemble.
   ===================================================================== */
(function visionneuse() {
  const declencheurs = [...document.querySelectorAll("a.zoom")];
  if (!declencheurs.length) return;

  const boite = document.createElement("dialog");
  boite.className = "visionneuse";
  boite.setAttribute("aria-label", "Visionneuse d'images");
  boite.innerHTML = `
    <div class="visionneuse__haut"><span class="visionneuse__compteur"></span><button data-fermer>Fermer ✕</button></div>
    <div class="visionneuse__image"><img alt=""></div>
    <div class="visionneuse__bas">
      <button data-prec>← Préc.</button>
      <p class="visionneuse__legende"></p>
      <button data-suiv>Suiv. →</button>
    </div>`;
  document.body.appendChild(boite);

  const img = boite.querySelector("img");
  const legende = boite.querySelector(".visionneuse__legende");
  const compteur = boite.querySelector(".visionneuse__compteur");
  let groupe = [], index = 0;

  function afficher(i) {
    index = (i + groupe.length) % groupe.length;
    const lien = groupe[index];
    const vignette = lien.querySelector("img");
    const fig = lien.closest("figure");
    img.src = lien.href;
    img.alt = vignette ? vignette.alt : "";
    legende.textContent = fig?.querySelector("figcaption")?.textContent.trim() || img.alt;
    compteur.textContent = `${index + 1} / ${groupe.length}`;
    boite.querySelector("[data-prec]").hidden = boite.querySelector("[data-suiv]").hidden = groupe.length < 2;
  }

  declencheurs.forEach((lien) => {
    lien.addEventListener("click", (e) => {
      e.preventDefault();
      const conteneur = lien.closest("[data-galerie]");
      groupe = conteneur ? [...conteneur.querySelectorAll("a.zoom")] : [lien];
      afficher(groupe.indexOf(lien));
      boite.showModal();
    });
  });

  boite.querySelector("[data-fermer]").addEventListener("click", () => boite.close());
  boite.querySelector("[data-prec]").addEventListener("click", () => afficher(index - 1));
  boite.querySelector("[data-suiv]").addEventListener("click", () => afficher(index + 1));
  boite.addEventListener("click", (e) => { if (e.target === boite || e.target.classList.contains("visionneuse__image")) boite.close(); });
  boite.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") afficher(index - 1);
    if (e.key === "ArrowRight") afficher(index + 1);
  });
})();


/* =====================================================================
   4. COMPARAISON AVANT / APRÈS (curseur)
   ===================================================================== */
document.querySelectorAll(".comparaison").forEach((bloc) => {
  const curseur = bloc.querySelector("input[type=range]");
  if (!curseur) return;
  const maj = () => bloc.style.setProperty("--position", `${curseur.value}%`);
  curseur.addEventListener("input", maj);
  maj();
});


/* =====================================================================
   5. LISTES DU DOSSIER contenu/
   Une page affiche une liste si elle contient par exemple :
   <div data-liste="references"></div>
   et charge le fichier contenu/references.js
   ===================================================================== */
const echapper = (t = "") => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const messageVide = (txt) => `<p class="vide">${txt}</p>`;

/* --- Références --- */
document.querySelectorAll('[data-liste="references"]').forEach((zone) => {
  const filtre = zone.dataset.categorie; // optionnel : n'afficher qu'une catégorie
  let liste = (window.REFERENCES || []).filter((r) => !filtre || r.categorie === filtre);
  if (!liste.length) { zone.innerHTML = messageVide("Aucune référence pour l'instant — à ajouter dans contenu/references.js"); return; }
  zone.innerHTML = `<div class="fiches">${liste.map((r) => `
    <article class="fiche">
      <div class="fiche__cat">${echapper(r.categorie)}${r.date ? `<br>${echapper(r.date)}` : ""}</div>
      <div>
        <h3 class="fiche__titre">${r.lien ? `<a href="${echapper(r.lien)}" target="_blank" rel="noopener">${echapper(r.titre)}</a>` : echapper(r.titre)}</h3>
        <p class="fiche__auteur">${echapper(r.auteur)}</p>
        ${r.image ? `<a class="zoom" href="${chemin(r.image)}"><img src="${chemin(r.image)}" alt="${echapper(r.titre)}" loading="lazy"></a>` : ""}
      </div>
      <div class="fiche__commentaire">
        ${r.commentaire ? `<p><strong>Ce que j'en retiens</strong>${echapper(r.commentaire)}</p>` : ""}
        ${r.pertinence ? `<p><strong>Pour le projet</strong>${echapper(r.pertinence)}</p>` : ""}
      </div>
    </article>`).join("")}</div>`;
});

/* --- Journal de bord (du plus récent au plus ancien) --- */
document.querySelectorAll('[data-liste="journal"]').forEach((zone) => {
  const liste = [...(window.JOURNAL || [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (!liste.length) { zone.innerHTML = messageVide("Le journal est vide — ajoute une entrée dans contenu/journal.js"); return; }
  const format = (d) => { try { return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; } };
  zone.innerHTML = `<ol class="journal">${liste.map((j) => `
    <li>
      <time datetime="${echapper(j.date)}">${format(j.date)}</time>
      <h3>${echapper(j.titre)}</h3>
      ${j.texte ? `<p>${echapper(j.texte)}</p>` : ""}
      ${j.etiquettes?.length ? `<div class="etiquettes">${j.etiquettes.map((t) => `<span>${echapper(t)}</span>`).join("")}</div>` : ""}
    </li>`).join("")}</ol>`;
});

/* --- Ressources (regroupées par catégorie) --- */
document.querySelectorAll('[data-liste="ressources"]').forEach((zone) => {
  const liste = window.RESSOURCES || [];
  if (!liste.length) { zone.innerHTML = messageVide("Aucune ressource pour l'instant — à ajouter dans contenu/ressources.js"); return; }
  const groupes = {};
  liste.forEach((r) => (groupes[r.categorie || "Divers"] ||= []).push(r));
  zone.innerHTML = Object.entries(groupes).map(([cat, items]) => `
    <section class="ressources-groupe">
      <h3>${echapper(cat)}</h3>
      <ul class="ressources">${items.map((r) => `
        <li>
          <div>
            <span class="titre">${r.lien ? `<a href="${echapper(r.lien)}" target="_blank" rel="noopener">${echapper(r.titre)}</a>` : echapper(r.titre)}</span>
            <span class="detail">${[r.auteur, r.date].filter(Boolean).map(echapper).join(" · ")}${r.commentaire ? ` — ${echapper(r.commentaire)}` : ""}</span>
          </div>
          <span class="type">${echapper(r.type || "")}</span>
        </li>`).join("")}</ul>
    </section>`).join("");
});
