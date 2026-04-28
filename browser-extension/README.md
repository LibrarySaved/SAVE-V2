# SaveStack - Extension Navigateur & PWA Mobile

## 🖥️ Extension Navigateur (Chrome/Firefox)

### Installation de l'extension

1. **Téléchargez l'extension**
   - Le dossier `browser-extension` contient tous les fichiers nécessaires

2. **Installation sur Chrome**
   - Ouvrez `chrome://extensions/`
   - Activez le "Mode développeur" en haut à droite
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `browser-extension`
   - L'extension SaveStack apparaîtra dans votre barre d'outils

3. **Installation sur Firefox**
   - Ouvrez `about:debugging#/runtime/this-firefox`
   - Cliquez sur "Charger un module complémentaire temporaire"
   - Sélectionnez le fichier `manifest.json` du dossier `browser-extension`

### Utilisation de l'extension

**Méthode 1: Popup**
- Cliquez sur l'icône SaveStack dans la barre d'outils
- Le popup affiche les informations de la page actuelle
- Cliquez sur "Sauvegarder dans SaveStack"

**Méthode 2: Clic droit (menu contextuel)**
- Faites un clic droit sur n'importe quel:
  - **Lien** → "Save link to SaveStack"
  - **Page** → "Save this page to SaveStack"
  - **Image** → "Save image to SaveStack"
  - **Vidéo** → "Save video to SaveStack"

**Méthode 3: Raccourci clavier**
- `Ctrl + Shift + S` (Windows/Linux)
- `Cmd + Shift + S` (Mac)

**Méthode 4: Bouton flottant (FAB)**
- Sur les sites de réseaux sociaux (Instagram, TikTok, YouTube, etc.)
- Un bouton violet flottant apparaît en bas à droite
- Cliquez dessus pour sauvegarder instantanément

---

## 📱 Application Mobile (PWA - "Partager vers...")

### Installation de la PWA

**Sur iPhone (Safari)**
1. Ouvrez https://social-hub-687.preview.emergentagent.com
2. Appuyez sur l'icône de partage (carré avec flèche vers le haut)
3. Faites défiler et appuyez sur "Sur l'écran d'accueil"
4. Appuyez sur "Ajouter"

**Sur Android (Chrome)**
1. Ouvrez https://social-hub-687.preview.emergentagent.com
2. Appuyez sur les 3 points en haut à droite
3. Appuyez sur "Installer l'application" ou "Ajouter à l'écran d'accueil"

### Utilisation du "Partager vers SaveStack"

Une fois la PWA installée, SaveStack apparaîtra dans le menu de partage de votre téléphone!

**Depuis Instagram:**
1. Trouvez un post/reel que vous voulez sauvegarder
2. Appuyez sur l'icône de partage (avion en papier)
3. Appuyez sur "Partager vers..."
4. Sélectionnez **SaveStack**
5. Le formulaire s'ouvre avec l'URL pré-remplie
6. Ajoutez un titre et sauvegardez!

**Depuis TikTok:**
1. Trouvez une vidéo à sauvegarder
2. Appuyez sur "Partager"
3. Faites défiler les options et appuyez sur "Copier le lien"
4. Ouvrez SaveStack et collez le lien

**Depuis YouTube:**
1. Appuyez sur "Partager" sous la vidéo
2. Sélectionnez **SaveStack** dans la liste
3. La vidéo sera sauvegardée automatiquement

**Depuis Twitter/X, Pinterest, LinkedIn, Facebook:**
- Même processus: Partager → SaveStack

---

## 🚀 Fonctionnement technique

### Extension navigateur
```
1. L'extension capture l'URL de la page
2. Détecte automatiquement la plateforme (Instagram, TikTok, etc.)
3. Ouvre SaveStack avec les paramètres pré-remplis:
   /dashboard?save=true&url=...&title=...&platform=...&type=...
4. L'utilisateur confirme et l'IA analyse le contenu
```

### PWA Web Share Target
```
1. L'utilisateur partage depuis n'importe quelle app
2. Le système envoie les données vers /share?url=...&title=...
3. SaveStack ouvre le formulaire de sauvegarde rapide
4. L'IA traite le contenu en arrière-plan
```

---

## 📁 Structure des fichiers

```
/app/browser-extension/
├── manifest.json       # Configuration de l'extension
├── background.js       # Service worker (menu contextuel, raccourcis)
├── popup.html          # Interface popup
├── popup.js            # Logique du popup
├── content.js          # Injecté sur les pages (FAB, raccourcis)
├── content.css         # Styles pour le FAB et les toasts
└── icons/              # Icônes de l'extension

/app/frontend/public/
└── manifest.json       # Configuration PWA avec share_target

/app/frontend/src/pages/
├── SharePage.jsx       # Page de réception des partages mobiles
└── DashboardPage.jsx   # Gère les paramètres ?save=true&url=...
```

---

## 🔧 Configuration requise

- **Extension**: Chrome 88+ ou Firefox 89+
- **PWA**: iOS 15+ (Safari) ou Android 8+ (Chrome)
- **Connexion**: L'utilisateur doit être connecté à SaveStack

---

## 🎯 Avantages

✅ **1 clic** pour sauvegarder depuis le navigateur  
✅ **Partage natif** comme WhatsApp sur mobile  
✅ **Détection automatique** de la plateforme et du type  
✅ **Analyse IA** automatique du contenu  
✅ **Fonctionne partout**: Instagram, TikTok, YouTube, Twitter, Pinterest, etc.
