// Test unitaire simple pour vérifier les fonctions utilitaires
// Vous pouvez exécuter ce code dans la console Chrome pour tester

// Test de formatage de date
function testFormatDate() {
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    const testDate = new Date('2024-02-05');
    console.log('Test formatDate:', formatDate(testDate)); // Devrait afficher "05/02/2024"
}

// Test d'extraction de domaine
function testExtractDomain() {
    const extractDomain = (url) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        } catch (e) {
            return url;
        }
    };
    
    console.log('Test extractDomain Google:', extractDomain('https://www.google.fr/search?q=test'));
    console.log('Test extractDomain Korben:', extractDomain('https://korben.info/article.html'));
    console.log('Test extractDomain invalid:', extractDomain('not-a-url'));
}

// Test de structure de données
function testDataStructure() {
    const sampleData = {
        "05/02/2024": {
            "1": "www.google.fr",
            "2": "korben.info",
            "3": "github.com"
        },
        "04/02/2024": {
            "1": "stackoverflow.com",
            "2": "developer.mozilla.org"
        }
    };
    
    console.log('Structure JSON de test:', JSON.stringify(sampleData, null, 2));
    console.log('Nombre de jours:', Object.keys(sampleData).length);
    console.log('Sites du 05/02:', Object.values(sampleData["05/02/2024"]));
}

// Exécuter tous les tests
function runAllTests() {
    console.log('=== Tests de l\'extension History Profile Extractor ===');
    testFormatDate();
    testExtractDomain();
    testDataStructure();
    console.log('=== Fin des tests ===');
}

// Décommenter la ligne suivante pour exécuter les tests
// runAllTests();
