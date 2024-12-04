const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const passwordAlert = document.getElementById('password-alert');
const userAlert = document.getElementById('user-alert');

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
            document.location.href = '/index.html';
        } else {
            if (result === 'Cet utilisateur n\'existe pas') {
                userAlert.innerHTML = 'Utilisateur non trouvé. Veuillez vérifier votre email ou mot de passe.';
            } else if (result === 'Mot de passe incorrect') {
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