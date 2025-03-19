const registerForm = document.getElementById('register-form');
const errorMsg = document.getElementById('error-msg');
const userAlert = document.getElementById('user-alert');
const passwordAlert = document.getElementById('password-alert');

// REGISTER
registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMsg.innerHTML = '';
    passwordAlert.innerHTML = '';
    userAlert.innerHTML = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    const password = document.getElementById('password').value;

    // Regex patterns
    const namePattern = /^[a-zA-Z]{3,16}$/; // Only letters, between 3 and 16 characters
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[^\s]{6,}$/;

    // Validate fields
    let isValid = true;

    if (!namePattern.test(name)) {
        userAlert.innerHTML += "Merci de renseigner un nom valide (3 caractères minimum, pas de chiffre).";
        isValid = false;
    }

    if (!passwordPattern.test(password)) {
        passwordAlert.innerHTML += "MDP : 6 caractères minimum, 1 lettre majuscule, 1 chiffre, 1 caractère spécial.";
        isValid = false;
    }

    if (password !== confirmPassword) {
        passwordAlert.innerHTML += "Les mots de passe ne correspondent pas.";
        isValid = false;
    }

    if (!isValid) {
        return; // Exit the function if validation fails
    }

    // Si tout est bon, on envoie la requête
    const response = await fetch(`${API_CONFIG.baseUrl}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    // Si la requête est un succès, on redirige l'utilisateur vers la page de login
    const result = await response.json();
    if (response.ok) {
        document.location.href = '/login.html';
    } else {
        errorMsg.innerHTML = result.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
    }
});
