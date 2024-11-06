const loginForm = document.getElementById('login-form');

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
            console.log('Login successful:', result);
            setCookie('jwt', result.token, 1); // Store le token dans un cookie pendant 1 jour
            // Ajouter la redirection vers la page d'accueil par exemple
        } else {
            console.error('Login failed:', result);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// LOGOUT
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        deleteCookie('jwt');
        console.log('Logged out');
        // Ajouter la redirection vers une page de logout par exemple
    });
}
