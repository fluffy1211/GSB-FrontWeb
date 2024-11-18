const registerForm = document.getElementById('register-form');
const errorMsg = document.getElementById('error-msg');
const userAlert = document.getElementById('user-alert')
const passwordAlert = document.getElementById('password-alert')

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
    const namePattern = /^[a-zA-Z]{3,16}$/; // Only letters, between 3 and 30 characters
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least one uppercase letter and one number

    // Validate fields
    if (!namePattern.test(name)) {
        userAlert.innerHTML += "Merci de renseigner un nom valide (3 caractères minimum)";
        return;
    }

    if (!passwordPattern.test(password)) {
        passwordAlert.innerHTML += "MDP : 8 caractères minimum, 1 lettre majuscule, 1 chiffre";
        return;
    }

    // If all validations pass, proceed with the fetch request
    const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });


    const result = await response.json();
    if (response.ok) {
        document.location.href = 'login.html';
    } else {
        if (result === 'Cet email est déjà utilisé') {
            userAlert.innerHTML = 'Cet email est déjà utilisé';
        } else if (result === 'Ce nom d\'utilisateur est déjà pris') {
            userAlert.innerHTML = 'Ce nom d\'utilisateur est déjà pris';
        } else  {
            errorMsg.innerHTML = 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
    }
    if (password !== confirmPassword) {
        passwordAlert.innerHTML += "Les mots de passe ne correspondent pas.";
    }
});

//partie ajoutée pour confirmer le mot de passe
