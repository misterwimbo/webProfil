document.addEventListener('DOMContentLoaded', function() {
    const extractBtn = document.getElementById('extractBtn');
    const previewBtn = document.getElementById('previewBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const promptBtn = document.getElementById('promptBtn');
    const progress = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    const status = document.getElementById('status');
    const preview = document.getElementById('preview');
    const promptArea = document.getElementById('promptArea');
    
    let profileData = null;
    
    // Prompt d'analyse pour l'IA
    const ANALYSIS_PROMPT = `MISSION DE PROFILING AVANCÉ - ANALYSE COMPORTEMENTALE NUMÉRIQUE

Tu es un expert profiler comportemental spécialisé dans l'analyse forensique numérique. Ton objectif : créer un profil psychologique et sociologique complet à partir de données de navigation web.

CONTEXTE :
Le fichier JSON contient l'historique de navigation complet d'un individu, incluant :
- Historique de navigation avec timestamps
- Extensions installées
- Patterns temporels d'utilisation
- Sites visités et fréquence
- Données comportementales

ANALYSE REQUISE :

🔍 IDENTIFICATION PERSONNELLE :
- Prénom probable (indices linguistiques, comptes, recherches)
- Nom de famille probable (même sources)
- Âge estimé (±5 ans) avec justifications
- Genre probable et indices comportementaux

👤 PROFIL SOCIO-PROFESSIONNEL :
- Métier/secteur d'activité (précis avec niveau de certitude %)
- Niveau d'éducation et spécialisations
- Situation familiale (célibataire, en couple, enfants)
- Localisation géographique (ville, région, pays)
- Niveau socio-économique estimé

⏰ ANALYSE COMPORTEMENTALE TEMPORELLE :
- Patterns d'activité (heures de pointe, jours préférés)
- Rythme de vie (lève-tôt/couche-tard, week-end vs semaine)
- Habitudes de sommeil déduites
- Moments de stress/détente identifiés

🎯 PROFIL PSYCHOLOGIQUE :
- Personnalité (Big Five si possible)
- Centres d'intérêts principaux et secondaires
- Obsessions/passions détectées
- Peurs/anxiétés potentielles
- Traits de caractère dominants

🔒 ANALYSE DES SECRETS/COMPORTEMENTS CACHÉS :
- Navigation privée/incognito patterns
- Recherches supprimées ou suspectes
- Comportements contradictoires
- Addictions potentielles (jeux, shopping, contenu spécifique)
- Relations secrètes ou activités dissimulées

🛡️ PROFIL SÉCURITÉ/TECHNOLOGIQUE :
- Niveau de compétence technique (1-10)
- Conscience de la sécurité numérique
- Vulnérabilités comportementales
- Usage des VPN/outils de protection

ANALYSE DES EXTENSIONS :
Pour chaque extension, déduire :
- Objectif d'usage professionnel/personnel
- Niveau de sophistication technique
- Besoins spécifiques révélés

FORMAT DE RÉPONSE EXIGÉ :

1. **PROFIL JSON STRUCTURÉ** :
\`\`\`json
{
  "identite": {
    "prenom_probable": "...",
    "nom_probable": "...",
    "age_estime": "XX-XX ans",
    "genre": "...",
    "certitude_identite": "XX%"
  },
  "profil_socio_professionnel": {
    "metier": "...",
    "secteur": "...",
    "niveau_education": "...",
    "situation_familiale": "...",
    "localisation": "...",
    "niveau_socio_economique": "..."
  },
  "patterns_temporels": {
    "heures_activite_max": [...],
    "jours_actifs": [...],
    "rythme_sommeil": "...",
    "moments_stress": [...]
  },
  "profil_psychologique": {
    "personnalite_dominante": "...",
    "centres_interet": [...],
    "peurs_anxietes": [...],
    "traits_caractere": [...]
  },
  "secrets_comportements_caches": {
    "navigation_privee_patterns": "...",
    "addictions_potentielles": [...],
    "comportements_contradictoires": "...",
    "activites_dissimulees": [...]
  },
  "competences_techniques": {
    "niveau": "X/10",
    "conscience_securite": "...",
    "vulnerabilites": [...]
  }
}
\`\`\`

2. **RAPPORT NARRATIF DÉTAILLÉ** (500-800 mots) :
Rédigé comme un rapport de profiling FBI, incluant :
- Synthèse de personnalité
- Motivations et drivers comportementaux
- Prédictions comportementales futures
- Recommandations d'approche si contact nécessaire

3. **GRAPHIQUES ET STATISTIQUES** :
- Graphique horaire d'activité (format ASCII ou description détaillée)
- Répartition par catégories de sites (%)
- Timeline des évolutions comportementales
- Heatmap des jours/heures d'activité

4. **NIVEAU DE CONFIANCE** :
Pour chaque déduction, indiquer le niveau de certitude (Faible/Moyen/Élevé/Très élevé)

MÉTHODOLOGIE :
- Croise-référence toutes les données
- Cherche les patterns récurrents et les anomalies
- Utilise la psychologie comportementale
- Applique des méthodes d'investigation numérique
- Justifie chaque déduction avec des preuves

ATTENTION : Sois créatif mais reste ancré dans la logique. Si les données sont insuffisantes pour une déduction, indique "Données insuffisantes" plutôt que d'inventer.

Procède maintenant à l'analyse complète du fichier JSON fourni.

Il me faut un rapport complet.`;
    
    // Fonction pour formater la date au format DD/MM/YYYY
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Fonction pour extraire les extensions installées
    async function extractExtensions() {
        return new Promise((resolve, reject) => {
            chrome.management.getAll(function(extensions) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                const extensionsList = {};
                let index = 1;
                
                extensions.forEach(extension => {
                    // Exclure les applications et ne garder que les extensions activées
                    if (extension.type === 'extension' && extension.enabled) {
                        extensionsList[index] = {
                            name: extension.name,
                            id: extension.id,
                            version: extension.version,
                            description: extension.description || 'Aucune description'
                        };
                        index++;
                    }
                });
                
                resolve(extensionsList);
            });
        });
    }

    // Fonction pour extraire les téléchargements
    async function extractDownloads() {
        return new Promise((resolve, reject) => {
            chrome.downloads.search({}, function(downloads) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                const downloadsList = {};
                let index = 1;
                
                downloads.forEach(download => {
                    if (download.state === 'complete') {
                        const date = new Date(download.startTime);
                        downloadsList[index] = {
                            nom_fichier: download.filename.split('\\').pop().split('/').pop(),
                            url_source: download.url,
                            taille: download.fileSize || 0,
                            date_telechargement: formatDate(date),
                            heure_telechargement: date.toLocaleTimeString('fr-FR'),
                            type_mime: download.mime || 'inconnu'
                        };
                        index++;
                    }
                });
                
                resolve(downloadsList);
            });
        });
    }

    // Fonction pour extraire les signets/favoris
    async function extractBookmarks() {
        return new Promise((resolve, reject) => {
            // Vérifier si l'API bookmarks est disponible
            if (!chrome.bookmarks || !chrome.bookmarks.getTree) {
                console.warn('API bookmarks non disponible');
                resolve({}); // Retourner un objet vide si non disponible
                return;
            }
            
            chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                const bookmarksList = {};
                let index = 1;
                
                function processBookmarkNode(node, parentTitle = '') {
                    if (node.url) {
                        // C'est un signet
                        bookmarksList[index] = {
                            titre: node.title || 'Sans titre',
                            url: node.url,
                            dossier_parent: parentTitle || 'Racine',
                            date_ajout: node.dateAdded ? formatDate(new Date(node.dateAdded)) : 'Inconnue'
                        };
                        index++;
                    }
                    
                    if (node.children) {
                        // C'est un dossier, traiter récursivement
                        node.children.forEach(child => {
                            processBookmarkNode(child, node.title || parentTitle);
                        });
                    }
                }
                
                bookmarkTreeNodes.forEach(node => processBookmarkNode(node));
                resolve(bookmarksList);
            });
        });
    }

    // Fonction pour analyser les patterns de rebond
    function analyzeBouncePatterns(historyData) {
        const bounceAnalysis = {
            sites_rebond_rapide: {},
            sites_engagement_long: {},
            moyenne_temps_par_domaine: {}
        };
        
        const domainTimes = {};
        
        // Analyser les temps entre visites pour détecter les rebonds
        Object.values(historyData).forEach(dayData => {
            const visits = Object.values(dayData).sort((a, b) => {
                const timeA = a.heure.split(':').map(n => parseInt(n));
                const timeB = b.heure.split(':').map(n => parseInt(n));
                return (timeA[0] * 3600 + timeA[1] * 60 + timeA[2]) - (timeB[0] * 3600 + timeB[1] * 60 + timeB[2]);
            });
            
            for (let i = 0; i < visits.length - 1; i++) {
                try {
                    const currentDomain = new URL(visits[i].url).hostname;
                    const nextDomain = new URL(visits[i + 1].url).hostname;
                    
                    if (currentDomain !== nextDomain) {
                        const currentTime = visits[i].heure.split(':').map(n => parseInt(n));
                        const nextTime = visits[i + 1].heure.split(':').map(n => parseInt(n));
                        
                        const currentSeconds = currentTime[0] * 3600 + currentTime[1] * 60 + currentTime[2];
                        const nextSeconds = nextTime[0] * 3600 + nextTime[1] * 60 + nextTime[2];
                        const timeDiff = nextSeconds - currentSeconds;
                        
                        if (!domainTimes[currentDomain]) {
                            domainTimes[currentDomain] = [];
                        }
                        domainTimes[currentDomain].push(timeDiff);
                    }
                } catch (e) {
                    // Ignorer les URLs malformées
                }
            }
        });
        
        // Classer les domaines par temps d'engagement
        Object.entries(domainTimes).forEach(([domain, times]) => {
            const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
            bounceAnalysis.moyenne_temps_par_domaine[domain] = Math.round(avgTime);
            
            if (avgTime < 30) { // Moins de 30 secondes = rebond rapide
                bounceAnalysis.sites_rebond_rapide[domain] = {
                    temps_moyen: Math.round(avgTime),
                    nombre_visites: times.length
                };
            } else if (avgTime > 300) { // Plus de 5 minutes = engagement long
                bounceAnalysis.sites_engagement_long[domain] = {
                    temps_moyen: Math.round(avgTime),
                    nombre_visites: times.length
                };
            }
        });
        
        return bounceAnalysis;
    }
    
    // Fonction pour traiter les données d'historique
    function processHistoryData(historyItems, resolve) {
        progressText.textContent = `Traitement de ${historyItems.length} entrées d'historique...`;
        
        // Organiser les données par date
        const organizedData = {};
        
        historyItems.forEach((item, index) => {
            if (index % 500 === 0) {
                progressText.textContent = `Traitement: ${index}/${historyItems.length}`;
            }
            
            const date = new Date(item.lastVisitTime);
            const dateKey = formatDate(date);
            const timeKey = date.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            
            if (!organizedData[dateKey]) {
                organizedData[dateKey] = {};
            }
            
            // Compter le nombre d'entrées pour cette date pour générer l'index
            const currentCount = Object.keys(organizedData[dateKey]).length + 1;
            
            // Inclure l'URL complète ET l'heure de visite
            organizedData[dateKey][currentCount] = {
                heure: timeKey,
                url: item.url,
                titre: item.title || 'Sans titre',
                nombre_visites: item.visitCount || 1
            };
        });
        
        // Trier les dates (plus récentes en premier)
        const sortedData = {};
        const sortedDates = Object.keys(organizedData).sort((a, b) => {
            const dateA = new Date(a.split('/').reverse().join('-'));
            const dateB = new Date(b.split('/').reverse().join('-'));
            return dateB - dateA;
        });
        
        sortedDates.forEach(date => {
            sortedData[date] = organizedData[date];
        });
        
        resolve(sortedData);
    }
    
    // Fonction pour extraire l'historique complet avec plusieurs stratégies
    async function extractHistory() {
        return new Promise((resolve, reject) => {
            progressText.textContent = 'Recherche de tout l\'historique disponible...';
            
            // Stratégie 1: Récupérer tout sans limites
            chrome.history.search({
                text: '',
                startTime: 0,  // Depuis le début des temps (1970)
                maxResults: 0  // Pas de limite
            }, function(historyItems) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                progressText.textContent = `Première recherche: ${historyItems.length} entrées trouvées`;
                
                // Si on a moins de 5000 entrées, essayer avec une limite plus haute
                if (historyItems.length < 5000) {
                    progressText.textContent = 'Tentative d\'extraction avec limite élevée...';
                    
                    chrome.history.search({
                        text: '',
                        startTime: 0,
                        maxResults: 999999  // Limite très haute
                    }, function(moreHistoryItems) {
                        if (chrome.runtime.lastError) {
                            // En cas d'erreur, utiliser le premier résultat
                            processHistoryData(historyItems, resolve);
                            return;
                        }
                        
                        const finalItems = moreHistoryItems.length > historyItems.length ? moreHistoryItems : historyItems;
                        progressText.textContent = `Extraction optimisée: ${finalItems.length} entrées récupérées`;
                        processHistoryData(finalItems, resolve);
                    });
                } else {
                    processHistoryData(historyItems, resolve);
                }
            });
        });
    }
    
    // Fonction pour télécharger le fichier JSON
    function downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        }, function(downloadId) {
            if (chrome.runtime.lastError) {
                showStatus('Erreur lors du téléchargement: ' + chrome.runtime.lastError.message, 'error');
            } else {
                showStatus('✅ Fichier téléchargé avec succès ! 🎯 Prochaines étapes :\n1️⃣ Allez sur ChatGPT ou Claude.ai\n2️⃣ Uploadez le fichier JSON téléchargé\n3️⃣ Utilisez le prompt d\'analyse (bouton "📋 Voir le prompt d\'analyse")\n4️⃣ Obtenez votre profil comportemental complet !', 'success');
            }
            URL.revokeObjectURL(url);
        });
    }
    
    // Fonction pour afficher le statut
    function showStatus(message, type) {
        status.textContent = message;
        status.className = 'status ' + type;
        status.style.display = 'block';
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
    
    // Gestionnaire pour le bouton d'extraction
    extractBtn.addEventListener('click', async function() {
        extractBtn.disabled = true;
        previewBtn.disabled = true;
        downloadBtn.disabled = true;
        progress.style.display = 'block';
        preview.style.display = 'none';
        
        try {
            // Extraire les extensions installées
            progressText.textContent = 'Extraction des extensions installées...';
            const extensions = await extractExtensions();
            
            // Extraire les téléchargements
            progressText.textContent = 'Extraction des téléchargements...';
            const downloads = await extractDownloads();
            
            // Extraire les signets/favoris
            progressText.textContent = 'Extraction des signets/favoris...';
            const bookmarks = await extractBookmarks();
            
            // Extraire l'historique complet
            progressText.textContent = 'Récupération de l\'historique complet...';
            const historyData = await extractHistory();
            
            // Analyser les patterns de rebond
            progressText.textContent = 'Analyse des patterns de rebond...';
            const bounceAnalysis = analyzeBouncePatterns(historyData);
            
            // Créer le profil complet
            progressText.textContent = 'Génération du profil utilisateur...';
            profileData = {
                extensions_installees: extensions,
                telechargements: downloads,
                signets_favoris: bookmarks,
                historique_navigation: historyData,
                analyse_rebond: bounceAnalysis,
                metadata: {
                    date_extraction: formatDate(new Date()),
                    heure_extraction: new Date().toLocaleTimeString('fr-FR'),
                    nombre_extensions: Object.keys(extensions).length,
                    nombre_telechargements: Object.keys(downloads).length,
                    nombre_signets: Object.keys(bookmarks).length,
                    nombre_jours_historique: Object.keys(historyData).length,
                    total_visites: Object.values(historyData).reduce((total, day) => total + Object.keys(day).length, 0),
                    sites_rebond_rapide: Object.keys(bounceAnalysis.sites_rebond_rapide).length,
                    sites_engagement_long: Object.keys(bounceAnalysis.sites_engagement_long).length
                }
            };
            
            // Afficher le bouton de téléchargement une fois les données extraites
            downloadBtn.style.display = 'inline-block';
            showStatus(`Profil extrait avec succès ! ${Object.keys(extensions).length} extensions, ${Object.keys(downloads).length} téléchargements, ${Object.keys(bookmarks).length} signets et ${Object.keys(historyData).length} jours d'historique récupérés (${profileData.metadata.total_visites} visites totales).`, 'success');
            
        } catch (error) {
            showStatus('Erreur: ' + error.message, 'error');
        } finally {
            progress.style.display = 'none';
            extractBtn.disabled = false;
            previewBtn.disabled = false;
            downloadBtn.disabled = false;
        }
    });
    
    // Gestionnaire pour le bouton de téléchargement
    downloadBtn.addEventListener('click', async function() {
        if (!profileData) {
            showStatus('Aucune donnée à télécharger. Extrayez d\'abord le profil.', 'error');
            return;
        }
        
        try {
            const now = new Date();
            const timestamp = formatDate(now).replace(/\//g, '-');
            const filename = `user-profile-complete-${timestamp}.json`;
            
            downloadJSON(profileData, filename);
            
        } catch (error) {
            showStatus('Erreur lors du téléchargement: ' + error.message, 'error');
        }
    });
    
    // Gestionnaire pour le bouton d'aperçu
    previewBtn.addEventListener('click', async function() {
        if (!profileData) {
            previewBtn.disabled = true;
            extractBtn.disabled = true;
            progress.style.display = 'block';
            
            try {
                // Extraire les extensions installées
                progressText.textContent = 'Extraction des extensions installées...';
                const extensions = await extractExtensions();
                
                // Extraire les téléchargements
                progressText.textContent = 'Extraction des téléchargements...';
                const downloads = await extractDownloads();
                
                // Extraire les signets/favoris
                progressText.textContent = 'Extraction des signets/favoris...';
                const bookmarks = await extractBookmarks();
                
                // Extraire l'historique complet
                progressText.textContent = 'Récupération de l\'historique complet...';
                const historyData = await extractHistory();
                
                // Analyser les patterns de rebond
                progressText.textContent = 'Analyse des patterns de rebond...';
                const bounceAnalysis = analyzeBouncePatterns(historyData);
                
                // Créer le profil complet
                progressText.textContent = 'Génération du profil utilisateur...';
                profileData = {
                    extensions_installees: extensions,
                    telechargements: downloads,
                    signets_favoris: bookmarks,
                    historique_navigation: historyData,
                    analyse_rebond: bounceAnalysis,
                    metadata: {
                        date_extraction: formatDate(new Date()),
                        heure_extraction: new Date().toLocaleTimeString('fr-FR'),
                        nombre_extensions: Object.keys(extensions).length,
                        nombre_telechargements: Object.keys(downloads).length,
                        nombre_signets: Object.keys(bookmarks).length,
                        nombre_jours_historique: Object.keys(historyData).length,
                        total_visites: Object.values(historyData).reduce((total, day) => total + Object.keys(day).length, 0),
                        sites_rebond_rapide: Object.keys(bounceAnalysis.sites_rebond_rapide).length,
                        sites_engagement_long: Object.keys(bounceAnalysis.sites_engagement_long).length
                    }
                };
                
                downloadBtn.style.display = 'inline-block';
            } catch (error) {
                showStatus('Erreur: ' + error.message, 'error');
                return;
            } finally {
                progress.style.display = 'none';
                extractBtn.disabled = false;
                previewBtn.disabled = false;
            }
        }
        
        // Afficher un aperçu limité
        const previewData = {
            extensions_installees: profileData.extensions_installees,
            telechargements: profileData.telechargements,
            signets_favoris: profileData.signets_favoris,
            historique_navigation: {},
            analyse_rebond: profileData.analyse_rebond,
            metadata: profileData.metadata
        };
        
        // Ajouter seulement les 2 premiers jours d'historique pour l'aperçu
        const historyDates = Object.keys(profileData.historique_navigation).slice(0, 2);
        historyDates.forEach(date => {
            previewData.historique_navigation[date] = profileData.historique_navigation[date];
        });
        
        const jsonPreview = JSON.stringify(previewData, null, 2);
        preview.textContent = jsonPreview + (Object.keys(profileData.historique_navigation).length > 2 ? '\n\n... (historique tronqué pour l\'aperçu)' : '');
        preview.style.display = 'block';
    });
    
    // Gestionnaire pour le bouton d'affichage du prompt
    promptBtn.addEventListener('click', function() {
        if (promptArea.style.display === 'none' || promptArea.style.display === '') {
            promptArea.textContent = ANALYSIS_PROMPT;
            promptArea.style.display = 'block';
            promptBtn.textContent = '🔼 Masquer le prompt';
            // Masquer les autres éléments
            preview.style.display = 'none';
        } else {
            promptArea.style.display = 'none';
            promptBtn.textContent = '📋 Voir le prompt d\'analyse';
        }
    });
});
