// ── PANIER ────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
    const badge = document.querySelector(".cart-badge");
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = total;
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartBadge();
    showCartNotification(product.title);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCartModal();
}

function changeQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
    updateCartBadge();
    renderCartModal();
}

function showCartNotification(title) {
    const notif = document.createElement("div");
    notif.textContent = `✅ "${title}" defkow si panier bi`;
    notif.style.cssText = `
        position: fixed; bottom: 1.5rem; right: 1.5rem;
        background: #6c63ff; color: white;
        padding: 0.8rem 1.2rem; border-radius: 8px;
        font-size: 0.9rem; z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2500);
}

function createCartModal() {
    const html = `
    <div id="cart-overlay" class="auth-overlay hidden">
        <div class="auth-modal" style="max-width: 520px; width: 100%;">
            <button class="auth-close-btn" onclick="closeCartModal()">✕</button>
            <h2>🛒 Panier bi</h2>
            <div id="cart-items"></div>
            <div id="cart-footer"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
}

function renderCartModal() {
    const container = document.getElementById("cart-items");
    const footer = document.getElementById("cart-footer");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#999; padding: 2rem 0;">Panier bi nekk noppaleel 🛒</p>`;
        footer.innerHTML = "";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div style="display:flex; align-items:center; gap:1rem; padding: 0.8rem 0; border-bottom: 1px solid #eee;">
            <img src="${item.image}" alt="${item.title}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">
            <div style="flex:1;">
                <p style="font-weight:600; margin:0;">${item.title}</p>
                <p style="color:#6c63ff; margin:0.2rem 0;">${item.price} FCFA</p>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
                <button onclick="changeQuantity('${item.id}', -1)" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;cursor:pointer;font-size:1rem;">−</button>
                <span style="font-weight:600;">${item.quantity}</span>
                <button onclick="changeQuantity('${item.id}', 1)" style="width:28px;height:28px;border-radius:50%;border:1px solid #ddd;cursor:pointer;font-size:1rem;">+</button>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:1.2rem;">🗑</button>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    footer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
            <span style="font-size:1.1rem; font-weight:700;">Total : ${total.toLocaleString()} FCFA</span>
            <button onclick="handleCommander()" style="background:#6c63ff;color:white;border:none;padding:0.7rem 1.4rem;border-radius:8px;cursor:pointer;font-size:1rem;">
                Commander
            </button>
        </div>
    `;
}

function openCartModal() {
    renderCartModal();
    document.getElementById("cart-overlay").classList.remove("hidden");
}

function closeCartModal() {
    document.getElementById("cart-overlay").classList.add("hidden");
}

// ── WISHLIST ──────────────────────────────────────────
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function isInWishlist(id) {
    return wishlist.some(item => item.id === String(id));
}

function updateWishlistBadge() {
    const badge = document.querySelector(".wishlist-badge");
    if (badge) badge.textContent = wishlist.length;
}

function toggleWishlist(product) {
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index === -1) {
        wishlist.push(product);
    } else {
        wishlist.splice(index, 1);
    }
    saveWishlist();
    updateWishlistBadge();
    renderWishlistModal();
}

function removeFromWishlist(id) {
    wishlist = wishlist.filter(item => item.id !== id);
    saveWishlist();
    updateWishlistBadge();
    renderWishlistModal();
    const btn = document.querySelector(`.wishlist-btn[data-id="${id}"]`);
    if (btn) { btn.textContent = '🤍'; btn.classList.remove('active'); }
}

function createWishlistModal() {
    const html = `
    <div id="wishlist-overlay" class="auth-overlay hidden">
        <div class="auth-modal" style="max-width: 520px; width: 100%;">
            <button class="auth-close-btn" onclick="closeWishlistModal()">✕</button>
            <h2>❤️ Mes Favoris</h2>
            <div id="wishlist-items"></div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
}

function renderWishlistModal() {
    const container = document.getElementById("wishlist-items");
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#999;padding:2rem 0;">Aucun favori pour l'instant 🤍</p>`;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div style="display:flex;align-items:center;gap:1rem;padding:0.8rem 0;border-bottom:1px solid #eee;">
            <img src="${item.image}" alt="${item.title}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
            <div style="flex:1;">
                <p style="font-weight:600;margin:0;">${item.title}</p>
                <p style="color:#6c63ff;margin:0.2rem 0;">${item.price} FCFA</p>
            </div>
            <button onclick="removeFromWishlist('${item.id}')"
                style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:1.2rem;">🗑</button>
        </div>
    `).join("");
}

function openWishlistModal() {
    renderWishlistModal();
    document.getElementById("wishlist-overlay").classList.remove("hidden");
}

function closeWishlistModal() {
    document.getElementById("wishlist-overlay").classList.add("hidden");
}

function setupWishlistActions() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const { id, title, price, image } = button.dataset;
            toggleWishlist({ id, title, price: parseFloat(price), image });
            const inWishlist = isInWishlist(id);
            button.textContent = inWishlist ? '❤️' : '🤍';
            button.classList.toggle('active', inWishlist);
        });
    });
}

// ── PRODUITS ──────────────────────────────────────────
function generateProductCardHTML(product) {
    const id = product._id;
    const title = product.name || "Produit sans nom";
    const price = product.price || 0;
    const oldPrice = product.oldPrice;
    const image = product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";
    const rating = product.rating || "4.5";
    const reviews = product.reviewsCount || "0";
    const inWishlist = isInWishlist(String(id));

    return `
      <div class="product-card" data-id="${id}" data-title="${title}" data-price="${price}" data-image="${image}">
        <div class="product-image-container">
          <button class="wishlist-btn ${inWishlist ? 'active' : ''}"
                  data-id="${id}" data-title="${title}"
                  data-price="${price}" data-image="${image}">
              ${inWishlist ? '❤️' : '🤍'}
          </button>
          <img src="${image}" alt="${title}" class="product-img">
        </div>
        <div class="product-info">
          <h3 class="product-title">${title}</h3>
          <div class="product-rating">
            <span class="stars">⭐</span>
            <span class="rating-value">${rating}</span>
            <span class="rating-count">(${reviews})</span>
          </div>
          <div class="product-price-row">
            <span class="current-price">${price} FCFA</span>
            ${oldPrice ? `<span class="old-price">${oldPrice} FCFA</span>` : ''}
          </div>
          <button class="add-to-cart-btn">Defko si panier bi</button>
        </div>
      </div>
    `;
}

function isLoggedIn() {
    return !!localStorage.getItem("token");
}

function handleCommander() {
    if (!isLoggedIn()) {
        closeCartModal();
        showLogin();
        return;
    }
    alert("Commande en cours de traitement !");
}

function setupCartActions() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!isLoggedIn()) {
                showLogin();
                return;
            }
            const card = event.target.closest('.product-card');
            addToCart({
                id: card.dataset.id,
                title: card.dataset.title,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image,
            });
        });
    });
}

let allProducts = [];

async function initProductsSection() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #666;">Chargement des produits en cours...</p>`;

    allProducts = await getBestSellingProducts();

    if (allProducts.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">Impossible de charger les produits actuellement.</p>`;
        return;
    }

    renderProducts(allProducts);
}

function renderProducts(list) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    if (list.length === 0) {
        productsGrid.innerHTML = `<p class="no-results">Aucun produit trouvé 😕</p>`;
        return;
    }

    productsGrid.innerHTML = list.map(product => generateProductCardHTML(product)).join('');
    setupCartActions();
    setupWishlistActions();
}

function setupSearch() {
    const toggle = document.getElementById('search-toggle');
    const bar = document.getElementById('search-bar');
    const input = document.getElementById('search-input');
    const clear = document.getElementById('search-clear');

    toggle?.addEventListener('click', () => {
        bar.classList.toggle('active');
        if (bar.classList.contains('active')) input.focus();
        else {
            input.value = '';
            renderProducts(allProducts);
        }
    });

    input?.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const filtered = allProducts.filter(p =>
            (p.name || '').toLowerCase().includes(query)
        );
        renderProducts(filtered);
        if (query) {
            document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
        }
    });

    clear?.addEventListener('click', () => {
        input.value = '';
        bar.classList.remove('active');
        renderProducts(allProducts);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createCartModal();
    createWishlistModal();
    updateCartBadge();
    updateWishlistBadge();
    initProductsSection();
    setupSearch();

    document.addEventListener("click", (e) => {
        if (e.target.closest(".cart-btn")) {
            e.preventDefault();
            openCartModal();
        }
        if (e.target.closest(".wishlist-nav-btn")) {
            e.preventDefault();
            openWishlistModal();
        }
    });
});
