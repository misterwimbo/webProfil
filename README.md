# User Profile Extractor - Extension Chrome v2.0

## Description
Cette extension Chrome extrait un profil utilisateur complet incluant l'historique de navigation ET les extensions installées, le tout sauvegardé dans un fichier JSON structuré pour permettre une analyse approfondie du profil utilisateur par des LLM.

## Nouveau format de sortie JSON v2.0
```json
{
    "extensions_installees": {
        "1": {
            "name": "AdBlock Plus",
            "id": "cfhdojbkjhnklbpkdaibdccddilifddb",
            "version": "3.15.2",
            "description": "Bloque les publicités"
        },
        "2": {
            "name": "Tampermonkey",
            "id": "dhdgffkkebhmkfjojejmpbldmpobfkfo",
            "version": "4.18.0",
            "description": "Gestionnaire de scripts utilisateur"
        }
    },
    "historique_navigation": {
        "02/02/2022": {
            "1": {
                "heure": "09:15:32",
                "url": "https://www.google.com/search?q=extension+chrome+développement",
                "titre": "extension chrome développement - Recherche Google",
                "nombre_visites": 1
            },
            "2": {
                "heure": "14:22:18", 
                "url": "https://korben.fr/article-intelligence-artificielle.html",
                "titre": "L'IA va-t-elle remplacer les développeurs ?",
                "nombre_visites": 3
            }
        },
        "01/02/2022": {
            "1": {
                "heure": "23:45:12",
                "url": "https://stackoverflow.com/questions/chrome-extension-api",
                "titre": "Chrome Extension API - Stack Overflow", 
                "nombre_visites": 2
            }
        }
    },
    "metadata": {
        "date_extraction": "01/08/2025",
        "heure_extraction": "14:30:15",
        "nombre_extensions": 12,
        "nombre_jours_historique": 365,
        "total_visites": 15420
    }
}
```

## 🚀 Nouvelles fonctionnalités v2.1
- ✅ **Extraction des extensions installées** (nom, ID, version, description)
- ✅ **Historique complet avec URLs détaillées** (paramètres de recherche, pages spécifiques)
- ✅ **Horodatage précis** (heure exacte de chaque visite - HH:MM:SS)
- ✅ **Titres des pages** (titre complet de chaque page visitée)
- ✅ **Compteur de visites** (nombre de fois qu'une page a été visitée)
- ✅ **URLs complètes** (informations détaillées avec paramètres)
- ✅ **Métadonnées enrichies** (statistiques d'extraction)
- ✅ **Profil utilisateur complet** pour analyse LLM avancée

## Fonctionnalités existantes
- ✅ Extraction via API Chrome native
- ✅ Organisation des données par date (DD/MM/YYYY)
- ✅ Numérotation séquentielle des sites et extensions
- ✅ Interface utilisateur intuitive
- ✅ Aperçu du JSON avant téléchargement
- ✅ Téléchargement automatique du fichier JSON

## Installation

### 1. Préparation
1. Clonez ou téléchargez ce projet
2. Ajoutez des icônes dans le dossier `icons/` (16x16, 48x48, 128x128 pixels)

### 2. Installation dans Chrome
1. Ouvrez Chrome et allez dans `chrome://extensions/`
2. Activez le "Mode développeur" en haut à droite
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier contenant les fichiers de l'extension
5. L'extension apparaîtra dans la barre d'outils

## Utilisation
1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Cliquez sur "Aperçu JSON" pour voir un échantillon des données (optionnel)
3. Cliquez sur "Extraire l'historique" pour récupérer le profil complet
4. Cliquez sur "Télécharger JSON" pour sauvegarder le fichier

## Permissions requises
- `history` : Pour accéder à l'historique de navigation
- `downloads` : Pour télécharger le fichier JSON généré
- `management` : Pour lister les extensions installées

## Analyse avancée des données
Le fichier JSON généré peut être analysé par des LLM pour :
- **Profil de navigation détaillé** : recherches exactes, pages consultées, paramètres d'URL
- **Patterns temporels précis** : heures de navigation, habitudes horaires, pics d'activité
- **Rythmes de vie** : horaires de travail, veille tardive, habitudes weekend/semaine
- **Intentions de recherche** : termes recherchés sur Google, Bing, etc.
- **Centres d'intérêt précis** : articles spécifiques, sujets techniques, loisirs
- **Fréquence d'utilisation** : sites/pages les plus visités
- **Profil technique** : extensions utilisées, niveau d'expertise
- **Profil sécuritaire** : extensions de sécurité, bloqueurs de pub
- **Profil productivité** : outils de développement, extensions professionnelles
- **Analyse comportementale** : corrélation entre extensions, sites, heures et fréquences

## Notes techniques
- Compatible avec Manifest V3
- Utilise l'API Chrome Extensions moderne
- Interface responsive
- Gestion d'erreurs intégrée
- Progress indicator pour les gros volumes de données

## Améliorations futures possibles
- Filtrage par type de site
- Export en différents formats (CSV, XML)
- Analyse intégrée des données
- Graphiques de visualisation
- Sauvegarde cloud
