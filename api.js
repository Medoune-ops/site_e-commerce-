// On cible le port 3000 et le préfixe "/api" configuré dans ton fichier principal Node.js
const API_BASE_URL = "http://localhost:3000/api"; 

/**
 * Va chercher la liste des produits depuis l'API REST
 * @returns {Promise<Array>} Un tableau d'objets produits
 */
async function getBestSellingProducts() {
    try {
        // Cela va appeler : http://localhost:3000/api/products
        const response = await fetch(`${API_BASE_URL}/products`); 
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }
        
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Erreur lors de la récupération des produits de l'API :", error);
        return []; 
    }
}