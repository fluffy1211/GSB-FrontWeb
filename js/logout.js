// Supprimer un cookie
function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
}

// LOGOUT
const logoutButton = document.getElementById('logoutBtn');
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        deleteCookie('jwt');
        console.log('Logged out');
        // Ajouter la redirection vers une page de logout par exemple
        document.location.href = 'index.html';
    });
}