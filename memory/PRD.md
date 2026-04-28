# SaveStack AI - Product Requirements Document

## Original Problem Statement
Créer une application qui permettrait de répertorier tout ce qu'on enregistre sur les réseaux sociaux notamment dans une seule application, trouve un business plan qui permettrait de tout centraliser, et de monétiser le projet.

**Upgrade Request:** Transform into an AI-powered content memory system with semantic search.

## User Personas
1. **Créateurs de contenu** - Sauvegardent des inspirations de plusieurs plateformes
2. **Digital marketers** - Collectent des exemples de campagnes et tendances
3. **Curateurs** - Organisent du contenu thématique pour référence
4. **Utilisateurs occasionnels** - Sauvegardent du contenu qu'ils veulent retrouver plus tard

## Core Requirements

### Plateformes supportées
- Instagram, TikTok, YouTube, Twitter/X, Facebook, Pinterest, LinkedIn

### Business Model
- 100% Gratuit avec publicités intégrées (modèle réseaux sociaux)
- Aucune limite de saves ou collections

### Authentification
- Google OAuth via Emergent Auth
- Email/password (coming soon)

## What's Been Implemented

### Version 1.0 (28/04/2026)
- [x] Landing page avec hero, features, business model
- [x] Système d'authentification Google OAuth
- [x] Dashboard avec grille de contenus
- [x] CRUD complet des contenus sauvegardés
- [x] Système de collections
- [x] Favoris
- [x] Thème sombre/clair
- [x] Composants publicitaires (bannières, natives, sticky footer)
- [x] Filtres par plateforme
- [x] Recherche textuelle basique

### Version 2.0 AI (28/04/2026)
- [x] **AI Content Processing Pipeline:**
  - Extraction automatique du contenu des URLs (trafilatura)
  - Résumé IA avec GPT-4o-mini
  - Extraction automatique de tags
  - Catégorisation automatique
- [x] **Semantic Search:**
  - Génération d'embeddings (text-embedding-3-small)
  - Recherche en langage naturel
  - Similarité cosinus pour le ranking
- [x] **Background Processing:**
  - Traitement asynchrone non-bloquant
  - Indicateurs de statut (pending, processing, completed, failed)
- [x] **New API Endpoints:**
  - POST /api/search (recherche sémantique)
  - GET /api/categories (catégories IA)
  - GET /api/user/export (export des données)
  - POST /api/content/{id}/reprocess (relancer l'analyse IA)
- [x] **UI Enhancements:**
  - Barre de recherche intelligente avec icône Brain
  - Cartes de contenu avec résumé IA et tags IA
  - Section catégories dans la sidebar
  - Indicateur de traitement IA sur les cartes

## Architecture

### Backend (FastAPI + MongoDB)
```
/api/auth/* - Authentification
/api/content/* - CRUD contenus
/api/collections/* - CRUD collections
/api/search - Recherche sémantique
/api/categories - Liste des catégories
/api/user/* - Stats et export
```

### Frontend (React + Tailwind + Shadcn/UI)
```
/app/frontend/src/pages/
  - LandingPage.jsx
  - LoginPage.jsx
  - DashboardPage.jsx (AI-enhanced)
  - CollectionsPage.jsx
  - SettingsPage.jsx

/app/frontend/src/components/
  - AdComponents.jsx (publicités simulées)
```

### Database Collections (MongoDB)
- users
- user_sessions
- saved_content (with AI fields: summary, ai_tags, category, ai_status)
- collections
- embeddings (vectors for semantic search)

## Prioritized Backlog

### P0 - Critical (Done)
- [x] Core save functionality
- [x] Authentication
- [x] AI processing pipeline
- [x] Semantic search

### P1 - High Priority
- [x] Extension navigateur pour sauvegarder en un clic (Chrome/Firefox)
- [x] PWA avec Web Share Target (partage mobile comme WhatsApp)
- [x] Page /share pour recevoir les partages
- [x] Notifications in-app quand le traitement AI est terminé (toasts + bell historique)
- [ ] Notifications push réelles (Service Worker + VAPID) — optionnel
- [ ] Import automatique via APIs officielles des réseaux sociaux

### P2 - Medium Priority  
- [ ] Export en différents formats (CSV, JSON, PDF)
- [ ] Partage de collections publiques
- [ ] Mode collaboratif (équipes)
- [ ] Analytics avancés sur les contenus

### P3 - Nice to Have
- [ ] Application mobile (React Native)
- [ ] Plugin Notion/Obsidian
- [ ] API publique pour développeurs
- [ ] Suggestions de contenus similaires

## Next Tasks
1. Publier l'extension sur Chrome Web Store et Firefox Add-ons
2. Implémenter l'import automatique via APIs officielles
3. Optimiser les performances des embeddings pour de gros volumes
4. Ajouter notifications push réelles via Service Worker + VAPID (P2 — pour l'instant in-app uniquement)

---

## v2.3 — Memories, Pitch Banner & i18n FR/EN (29/04/2026)

### Widget "Sur cette même date" (souvenirs Google Photos style)
- Backend: nouveau endpoint `GET /api/content/memories/on-this-day`
  - Calcule des fenêtres ±1 jour autour du même jour calendaire pour 1, 3, 6 mois, puis 1, 2, 3, 5 ans
  - Gère les bords de mois (ex: 31 mars → 28 février si l'an précédent n'a pas le 31)
  - Renvoie buckets avec items (jusqu'à 50/bucket), exclut `_id` et `raw_text`
- Frontend: composant `OnThisDayWidget` au-dessus de la grille du dashboard
  - Tabs par bucket cliquables (1 mois, 6 mois, 1 an...)
  - Carousel 4 vignettes avec animation + hover ExternalLink
  - Bouton Dismiss persistant pour la journée (localStorage)
  - Affichage uniquement sur dashboard principal (pas sur favoris/collections/recherche)

### Bannière pitch (remplace l'image Unsplash "Netflix-style")
- Image hero supprimée → bannière gradient avec card sombre + glow effects
- Texte: « Vous êtes fatigué de sauvegarder du contenu et de ne jamais le retrouver ? saved. est fait pour vous. »
- Grille 3 promesses avec icônes (Lightbulb, Layers, Users)
- Tagline finale italique: « Personnalisable à 100% : saved. est le miroir de vos réseaux sociaux préférés. »

### Internationalisation (FR / EN)
- Nouveau context `I18nContext` avec helper `t(key, params)`
- 2 langues actives: 🇫🇷 Français, 🇬🇧 English
- 5 langues "coming soon" (Espagnol, Allemand, Italien, Portugais, Japonais) affichées en grisé
- Auto-détection via `navigator.language` + persistance localStorage
- Composant `LanguageSwitcher` (icône Globe) ajouté à la navbar landing (desktop + mobile)
- 100% du contenu de la LandingPage traduit (Hero, Pitch, Features, Business model, Footer)

### Fichiers ajoutés / modifiés
```
/app/backend/server.py                                    (endpoint memories)
/app/frontend/src/contexts/I18nContext.jsx                (nouveau)
/app/frontend/src/components/LanguageSwitcher.jsx         (nouveau)
/app/frontend/src/components/OnThisDayWidget.jsx          (nouveau)
/app/frontend/src/App.js                                  (I18nProvider wrap)
/app/frontend/src/pages/LandingPage.jsx                   (pitch banner + i18n)
/app/frontend/src/pages/DashboardPage.jsx                 (OnThisDay widget)
```

### Backlog mis à jour
- [ ] Traduire DashboardPage, SettingsPage, CollectionsPage en EN (P1)
- [ ] Intégrer DeepL pour automatiser ES/DE/IT/PT/JA (P2)

---

## v2.2 — Rebranding "saved." & Notifications IA (29/04/2026)

### Rebranding
- Nom: **saved.** — *your digital library*
- Title HTML, manifest.json, browser-extension manifest mis à jour
- Métadonnées PWA (theme_color #8B5CF6, background_color #0F0F12)

### Icônes officielles
- Générées via `/app/scripts/generate_icons.py` (PIL)
- Sizes: 16, 32, 48, 64, 96, 128, 192, 256, 384, 512 px (PNG)
- Variantes maskable 192/512 pour PWA Android
- favicon.ico multi-résolution, apple-touch-icon 180px
- Icônes browser extension (16/32/48/128) régénérées
- Style: rounded square purple (#8B5CF6) + bookmark blanc + dot accent

### Notifications IA in-app (choix utilisateur)
- `NotificationsProvider` réécrit pour utiliser `sonner` toasts + historique persistant (localStorage, max 50)
- Composant `NotificationsBell` ajouté dans la topbar dashboard:
  - Badge animé pendant le traitement IA (cloche qui s'agite)
  - Compteur de notifications non lues
  - Popover avec historique, dates relatives, marquer comme lu, effacer
- Polling toutes les 5s sur `ai_status` → toast + entrée historique quand l'IA termine
- `trackProcessing` synchronisé automatiquement avec les éléments en `processing`/`pending`

### Bug critique corrigé
- Variables CSS `--background`, `--foreground`, etc. en format RGB cassé (`250 250 250`) → restaurées en HSL (`0 0% 100%`). La landing page s'affichait en jaune fluo.

### Fichiers modifiés / créés
```
/app/frontend/src/index.css                      (HSL fix)
/app/frontend/src/App.js                         (Notifications via sonner)
/app/frontend/src/components/NotificationsBell.jsx (nouveau)
/app/frontend/src/pages/DashboardPage.jsx        (bell + tracking)
/app/frontend/public/manifest.json               (rebranding + icônes)
/app/frontend/public/index.html                  (favicons + title)
/app/frontend/public/icon-{16..512}.png          (nouvelles icônes)
/app/frontend/public/favicon.ico                 (multi-res)
/app/frontend/public/apple-touch-icon.png
/app/frontend/public/logo192.png + logo512.png
/app/browser-extension/manifest.json             (rebrand)
/app/browser-extension/icons/icon{16,32,48,128}.png
/app/scripts/generate_icons.py                   (script reproductible)
```

---

## Extension & PWA (v2.1 - 28/04/2026)

### Extension Navigateur
- **Popup** avec info de la page et bouton de sauvegarde
- **Menu contextuel** (clic droit) pour liens, pages, images, vidéos
- **Raccourci clavier** : Ctrl/Cmd + Shift + S
- **Bouton flottant (FAB)** sur les sites de réseaux sociaux
- **Détection automatique** de plateforme et type de contenu

### PWA Mobile (Web Share Target)
- **Partage natif** : SaveStack apparaît dans le menu "Partager vers..."
- **Page /share** : Reçoit les données partagées et ouvre le formulaire
- **Pré-remplissage automatique** de l'URL et détection de plateforme
- **Installation** sur écran d'accueil (iOS Safari, Android Chrome)

### Fichiers créés
```
/app/browser-extension/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── content.js
├── content.css
└── README.md

/app/frontend/src/pages/SharePage.jsx
/app/frontend/public/manifest.json (mise à jour avec share_target)
```
