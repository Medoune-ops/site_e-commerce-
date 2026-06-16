const AUTH_BASE_URL = "https://apisecur-production.up.railway.app";

function createAuthModals() {
    const html = `
    <div id="auth-overlay" class="auth-overlay hidden">

        <!-- Modale Connexion -->
        <div id="modal-login" class="auth-modal">
            <button class="auth-close-btn" onclick="closeAuthModals()">✕</button>
            <h2>Connexion</h2>
            <form id="form-login" onsubmit="handleLogin(event)">
                <div class="auth-field">
                    <label>Email</label>
                    <input type="email" id="login-email" placeholder="email@exemple.com" required>
                </div>
                <div class="auth-field">
                    <label>Mot de passe</label>
                    <input type="password" id="login-password" placeholder="••••••••" required>
                </div>
                <p id="login-error" class="auth-error hidden"></p>
                <button type="submit" class="auth-submit-btn">Se connecter</button>
            </form>
            <p class="auth-switch">Pas encore de compte ? <a href="#" onclick="showRegister()">S'inscrire</a></p>
        </div>

        <!-- Modale Inscription -->
        <div id="modal-register" class="auth-modal hidden">
            <button class="auth-close-btn" onclick="closeAuthModals()">✕</button>
            <h2>Inscription</h2>
            <form id="form-register" onsubmit="handleRegister(event)">
                <div class="auth-field">
                    <label>Email</label>
                    <input type="email" id="register-email" placeholder="email@exemple.com" required>
                </div>
                <div class="auth-field">
                    <label>Mot de passe</label>
                    <input type="password" id="register-password" placeholder="••••••••" required>
                </div>
                <p id="register-error" class="auth-error hidden"></p>
                <button type="submit" class="auth-submit-btn">Créer mon compte</button>
            </form>
            <p class="auth-switch">Déjà un compte ? <a href="#" onclick="showLogin()">Se connecter</a></p>
        </div>

    </div>`;

    document.body.insertAdjacentHTML("beforeend", html);

    const style = document.createElement("style");
    style.textContent = `
        .auth-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.5);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
        }
        .auth-overlay.hidden { display: none; }
        .auth-modal {
            background: #fff;
            border-radius: 12px;
            padding: 2rem;
            width: 100%;
            max-width: 420px;
            position: relative;
        }
        .auth-modal.hidden { display: none; }
        .auth-modal h2 { margin-bottom: 1.5rem; font-size: 1.5rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
        .auth-field label { font-size: 0.9rem; font-weight: 600; }
        .auth-field input {
            padding: 0.7rem 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
        }
        .auth-field input:focus { border-color: #6c63ff; }
        .auth-submit-btn {
            width: 100%;
            padding: 0.8rem;
            background: #6c63ff;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        .auth-submit-btn:hover { background: #574fd6; }
        .auth-close-btn {
            position: absolute; top: 1rem; right: 1rem;
            background: none; border: none;
            font-size: 1.2rem; cursor: pointer; color: #666;
        }
        .auth-switch { text-align: center; margin-top: 1rem; font-size: 0.9rem; }
        .auth-switch a { color: #6c63ff; text-decoration: none; font-weight: 600; }
        .auth-error { color: red; font-size: 0.85rem; margin-top: 0.5rem; }
        .auth-error.hidden { display: none; }
    `;
    document.head.appendChild(style);
}

function showLogin() {
    document.getElementById("auth-overlay").classList.remove("hidden");
    document.getElementById("modal-login").classList.remove("hidden");
    document.getElementById("modal-register").classList.add("hidden");
}

function showRegister() {
    document.getElementById("auth-overlay").classList.remove("hidden");
    document.getElementById("modal-register").classList.remove("hidden");
    document.getElementById("modal-login").classList.add("hidden");
}

function closeAuthModals() {
    document.getElementById("auth-overlay").classList.add("hidden");
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || "Identifiants incorrects";
            errorEl.classList.remove("hidden");
            return;
        }

        localStorage.setItem("token", data.token);
        closeAuthModals();
        updateNavForLoggedUser(email);
        await loadUserData();
        renderCartModal();
        renderWishlistModal();
    } catch (error) {
        errorEl.textContent = "Erreur de connexion au serveur";
        errorEl.classList.remove("hidden");
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const errorEl = document.getElementById("register-error");

    try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.message || "Erreur lors de l'inscription";
            errorEl.classList.remove("hidden");
            return;
        }

        localStorage.setItem("token", data.token);
        closeAuthModals();
        updateNavForLoggedUser(email);
    } catch (error) {
        errorEl.textContent = "Erreur de connexion au serveur";
        errorEl.classList.remove("hidden");
    }
}

function updateNavForLoggedUser(email) {
    const loginBtn = document.querySelector(".btn-login");
    const registerBtn = document.querySelector(".btn-register");
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) {
        registerBtn.textContent = email;
        registerBtn.removeEventListener("click", showRegister);
    }

    if (!document.getElementById("logout-btn")) {
        const logoutBtn = document.createElement("a");
        logoutBtn.id = "logout-btn";
        logoutBtn.href = "#";
        logoutBtn.className = "btn-auth btn-login";
        logoutBtn.textContent = "Déconnexion";
        logoutBtn.style.background = "#e74c3c";
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
        registerBtn.insertAdjacentElement("afterend", logoutBtn);
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    cart = [];
    wishlist = [];
    updateCartBadge();
    updateWishlistBadge();

    const loginBtn = document.querySelector(".btn-login");
    const registerBtn = document.querySelector(".btn-register");
    const logoutBtn = document.getElementById("logout-btn");

    if (loginBtn) loginBtn.style.display = "";
    if (registerBtn) {
        registerBtn.textContent = "Inscription";
        registerBtn.addEventListener("click", (e) => { e.preventDefault(); showRegister(); });
    }
    if (logoutBtn) logoutBtn.remove();
}

function checkAuthOnLoad() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            updateNavForLoggedUser(payload.email);
        } catch {}
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createAuthModals();
    checkAuthOnLoad();

    document.querySelector(".btn-login")?.addEventListener("click", (e) => {
        e.preventDefault();
        showLogin();
    });

    document.querySelector(".btn-register")?.addEventListener("click", (e) => {
        e.preventDefault();
        showRegister();
    });
});
