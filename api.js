// On cible le port 3000 et le préfixe "/api" configuré dans ton fichier principal Node.js
const API_BASE_URL = "https://apisecur-production.up.railway.app/api"; 

/**
 * Va chercher la liste des produits depuis l'API REST
 * @returns {Promise<Array>} Un tableau d'objets produits
 */
async function getBestSellingProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de la récupération des produits de l'API :", error);
        return [];
    }
}

const BACKEND_URL = "https://apisecur-production.up.railway.app";

async function syncCartToServer(cart) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
        await fetch(`${BACKEND_URL}/users/me/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ cart })
        });
    } catch (e) {}
}

async function syncWishlistToServer(wishlist) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
        await fetch(`${BACKEND_URL}/users/me/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ wishlist })
        });
    } catch (e) {}
}

async function loadUserData() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
        const [cartRes, wishlistRes] = await Promise.all([
            fetch(`${BACKEND_URL}/users/me/cart`, { headers: { "Authorization": `Bearer ${token}` } }),
            fetch(`${BACKEND_URL}/users/me/wishlist`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);
        if (cartRes.ok) {
            const serverCart = await cartRes.json();
            cart = Array.isArray(serverCart) ? serverCart : [];
            saveCart();
            updateCartBadge();
        }
        if (wishlistRes.ok) {
            const serverWishlist = await wishlistRes.json();
            wishlist = Array.isArray(serverWishlist) ? serverWishlist : [];
            saveWishlist();
            updateWishlistBadge();
        }
    } catch (e) {}
}