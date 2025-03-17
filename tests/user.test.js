// Import des dépendances nécessaires
const request = require('supertest');
const app = require('../server.js');
const userController = require('../controllers/userController');
const database = require('../database/db.js');

// Création d'un mock pour la base de données
jest.mock('../database/db.js', () => ({
    getConnection: jest.fn().mockResolvedValue({
        query: jest.fn().mockResolvedValue([]),
        release: jest.fn()
    })
}));

describe('Tests inscription utilisateur', () => {
    test("Renvoie un code 201 en cas de succès", async () => {
        // Création d'une requête simulée avec les données utilisateur
        const req = {
            body: {
                name: "TestUser",
                email: "test@example.com",
                password: "Password123!"
            }
        };
        
        // Création d'une réponse simulée avec les méthodes nécessaires
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn().mockReturnThis()
        };

        // Configuration du mock de base de données pour simuler les vérifications
        const mockConnection = await database.getConnection();
        mockConnection.query
            .mockResolvedValueOnce([])     // Simule la vérification de l'email
            .mockResolvedValueOnce([])     // Simule la vérification du user
            .mockResolvedValueOnce({ insertId: 1 }); // Simule l'insertion réussie
        
        // Exécution de la fonction d'inscription
        await userController.register(req, res);
        
        // Vérification que la réponse a bien le statut 201 (Created)
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test("Renvoie un code 400 si l'email existe déjà", async () => {
        const req = {
            body: {
                name: "TestUser",
                email: "existing@example.com",
                password: "Password123!"
            }
        };
        
        // Création d'une réponse simulée avec les méthodes nécessaires
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn().mockReturnThis()
        };

        // Configuration du mock pour simuler un email déjà existant
        const mockConnection = await database.getConnection();
        mockConnection.query
            .mockResolvedValueOnce([{ id: 1 }]);  // Simule un email déjà existant dans la base de données
        
        // Exécution de la fonction d'inscription
        await userController.register(req, res);
        
        // Vérification que la réponse a bien le statut 400
        expect(res.status).toHaveBeenCalledWith(400);
    });
});