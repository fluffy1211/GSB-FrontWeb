const logoutBtn = document.getElementById('logoutBtn');


// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Function to decode JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT token:', error);
        return null;
    }
}

// Get the JWT token from the cookie
const token = getCookie('jwt');

if (!token) {
    logoutBtn.style.display = 'none';
}

if (token) {
    const user = parseJwt(token);
    if (user) {
        const welcomeMsg = document.getElementById('welcome-msg');
        welcomeMsg.innerHTML = `Bienvenue, ${user.name}`;
    }
}
