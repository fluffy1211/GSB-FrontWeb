const messageDiv = document.getElementById('message');
console.log('admin.js');
document.getElementById('product').addEventListener('click', async () => {
    const name = document.querySelector('input[placeholder="Product Name"]').value;
    const description = document.querySelector('input[placeholder="Description"]').value;
    const price = document.querySelector('input[placeholder="Price"]').value;
    const imagePath = document.querySelector('input[placeholder="Image URL"]').value;
    const quantity = document.querySelector('input[placeholder="Quantity"]').value;

    const productData = { name, description, price, imagePath, quantity };

    try {
        const response = await fetch('http://192.168.1.61:3001/admin/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

         

        if (response.ok) {
            console.log('ça marche');
            messageDiv.textContent = "Produit bien ajouté!"; 
        } else {
            console.log("Erreur dans l'ajout");
            messageDiv.textContent = "Erreur dans l'ajout"; 
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Erreur dans la requête');
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = "Erreur dans la requête"; 
    }
});