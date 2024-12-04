// FILE: AP 2/GSB-FrontWeb/js/adminButton.js
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
        const adminButton = document.createElement('button');
        adminButton.textContent = 'Administrateur';
        adminButton.onclick = () => {
            document.location.href = '/admin.html';
        };
        adminButton.style.position = 'fixed';
        adminButton.style.bottom = '20px';
        adminButton.style.right = '20px';
        adminButton.style.padding = '10px 20px';
        adminButton.style.backgroundColor = '#007bff';
        adminButton.style.color = 'white';
        adminButton.style.border = 'none';
        adminButton.style.borderRadius = '5px';
        adminButton.style.cursor = 'pointer';
        document.body.appendChild(adminButton);
    }
});