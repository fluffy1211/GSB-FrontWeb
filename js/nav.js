// Récupérer le cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Décoder le token JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}

// Checker si le token est expiré
function isTokenExpired(token) {
    if (!token) return true;
    
    try {
        const decoded = parseJwt(token);
        if (!decoded.exp) return true;
        
        // exp is in seconds, Date.now() is in milliseconds
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
}

// Logout
function handleLogout() {
    document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    window.location.href = '/login.html';
}

const checkElements = setInterval(() => {
    const loginIcon = document.getElementById('login');
    const panierIcon = document.getElementById('panier');
    const profilIcon = document.getElementById('profil');
    const adminLink = document.getElementById('admin-link');

    if (loginIcon && panierIcon && profilIcon && adminLink) {
        clearInterval(checkElements);

        const token = getCookie('jwt');

        if (token) {
            // Check si le token est expiré
            if (isTokenExpired(token)) {
                handleLogout();
                return;
            }

            const user = parseJwt(token);
            if (user) {
                loginIcon.style.display = 'none';
                panierIcon.style.display = 'block';
                profilIcon.style.display = 'block';
                adminLink.style.display = user.role === 'admin' ? 'block' : 'none';
            }
        } else {
            loginIcon.style.display = 'block';
            panierIcon.style.display = 'none';
            profilIcon.style.display = 'none';
            adminLink.style.display = 'none';
        }
    }
}, 100);

// Ajouter un check régulier du token
setInterval(() => {
    const token = getCookie('jwt');
    if (token && isTokenExpired(token)) {
        handleLogout();
    }
}, 60000); // Check chaque minute