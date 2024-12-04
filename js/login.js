// FILE: AP 2/GSB-FrontWeb/js/login.js
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const passwordAlert = document.getElementById('password-alert');
const userAlert = document.getElementById('user-alert');

console.log('loaded');

// Ajouter un cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Supprimer un cookie
function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

// LOGIN
loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    passwordAlert.innerHTML = '';
    userAlert.innerHTML = '';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3001/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (response.ok) {
            setCookie('jwt', result.token, 1); // Store the token in a cookie for 1 day
            const payload = JSON.parse(atob(result.token.split('.')[1]));
            localStorage.setItem('role', payload.role); // Store the role in local storage
            document.location.href ='index.html'; // Redirect to the home page
        } else {
            if (result.message === 'User does not exist') {
                userAlert.innerHTML = 'Utilisateur non trouvé. Veuillez vérifier votre email ou mot de passe.';
            } else if (result.message === 'Invalid password') {
                passwordAlert.innerHTML = 'Mot de passe incorrect. Veuillez réessayer.';
            } else {
                errorMsg.innerHTML = 'Erreur lors de la connexion. Veuillez réessayer.';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorMsg.innerHTML = 'Erreur lors de la connexion. Veuillez réessayer.';
    }
});