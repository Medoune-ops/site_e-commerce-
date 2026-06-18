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
                    <div class="password-wrapper">
                        <input type="password" id="login-password" placeholder="••••••••" required>
                        <button type="button" class="toggle-password" onclick="togglePassword('login-password', this)">👁</button>
                    </div>
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
                    <label>Nom complet</label>
                    <input type="text" id="register-name" placeholder="Prénom Nom" required>
                </div>
                <div class="auth-field">
                    <label>Téléphone</label>
                    <input type="tel" id="register-phone" placeholder="+221 77 000 00 00">
                </div>
                <div class="auth-field">
                    <label>Email</label>
                    <input type="email" id="register-email" placeholder="email@exemple.com" required>
                </div>
                <div class="auth-field">
                    <label>Mot de passe</label>
                    <div class="password-wrapper">
                        <input type="password" id="register-password" placeholder="••••••••" required>
                        <button type="button" class="toggle-password" onclick="togglePassword('register-password', this)">👁</button>
                    </div>
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
            max-height: 90vh;
            overflow-y: auto;
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
            width: 100%;
            box-sizing: border-box;
        }
        .auth-field input:focus { border-color: #6c63ff; }
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .password-wrapper input { padding-right: 2.8rem; }
        .toggle-password {
            position: absolute; right: 0.7rem;
            background: none; border: none;
            cursor: pointer; font-size: 1rem; color: #888;
            padding: 0;
        }
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

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        btn.textContent = "🙈";
    } else {
        input.type = "password";
        btn.textContent = "👁";
    }
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
    const name = document.getElementById("register-name").value;
    const phone = document.getElementById("register-phone").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const errorEl = document.getElementById("register-error");

    try {
        const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, email, password })
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
    if (registerBtn) registerBtn.style.display = "none";

    if (!document.getElementById("user-menu")) {
        const initial = email ? email.charAt(0).toUpperCase() : "U";
        const shortName = email ? email.split("@")[0] : "Compte";

        const wrapper = document.createElement("div");
        wrapper.id = "user-menu";
        wrapper.style.cssText = "position:relative;display:inline-block;";

        wrapper.innerHTML = `
            <button id="user-menu-btn" style="
                display:flex;align-items:center;gap:8px;
                background:none;border:1.5px solid #ddd;
                border-radius:50px;padding:5px 12px 5px 6px;
                cursor:pointer;font-size:14px;font-weight:600;color:#333;
                transition:border-color 0.2s,background 0.2s;">
                <span style="
                    width:28px;height:28px;border-radius:50%;
                    background:linear-gradient(135deg,#8aaf3f,#6c63ff);
                    color:#fff;font-size:12px;font-weight:700;
                    display:flex;align-items:center;justify-content:center;
                    flex-shrink:0;">${initial}</span>
                <span style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${shortName}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div id="user-dropdown" style="
                display:none;position:absolute;right:0;top:calc(100% + 8px);
                background:#fff;border:1px solid #eee;border-radius:14px;
                box-shadow:0 8px 32px rgba(0,0,0,0.12);
                min-width:180px;overflow:hidden;z-index:999;">
                <a href="commandes.html" style="display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:14px;color:#333;text-decoration:none;transition:background 0.15s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                    Mes commandes
                </a>
                <a href="dashboard.html" style="display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:14px;color:#333;text-decoration:none;transition:background 0.15s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Dashboard
                </a>
                <hr style="margin:4px 0;border:none;border-top:1px solid #f0f0f0;">
                <button id="logout-btn" style="display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:14px;color:#e74c3c;background:none;border:none;width:100%;text-align:left;cursor:pointer;transition:background 0.15s;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Déconnexion
                </button>
            </div>`;

        if (registerBtn) {
            registerBtn.insertAdjacentElement("afterend", wrapper);
        } else if (loginBtn) {
            loginBtn.insertAdjacentElement("afterend", wrapper);
        } else {
            document.querySelector(".nav-actions")?.appendChild(wrapper);
        }

        document.getElementById("user-menu-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            const dd = document.getElementById("user-dropdown");
            dd.style.display = dd.style.display === "block" ? "none" : "block";
        });

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });

        document.addEventListener("click", () => {
            const dd = document.getElementById("user-dropdown");
            if (dd) dd.style.display = "none";
        });

        // Hover sur les liens du dropdown
        document.querySelectorAll("#user-dropdown a, #user-dropdown button").forEach(el => {
            el.addEventListener("mouseenter", () => el.style.background = "#f5f5f5");
            el.addEventListener("mouseleave", () => el.style.background = "");
        });
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
    const userMenu = document.getElementById("user-menu");

    if (loginBtn) loginBtn.style.display = "";
    if (registerBtn) {
        registerBtn.style.display = "";
        registerBtn.addEventListener("click", (e) => { e.preventDefault(); showRegister(); });
    }
    if (userMenu) userMenu.remove();
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
