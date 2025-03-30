const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.createAppointment = async (req, res) => {
    try {
        // Récupérer les données utilisateur du middleware
        const clientId = req.user.id;
        const clientName = req.user.name;

        if (!clientId) {
            return res.status(400).json({ error: 'Aucun client_id trouvé dans le token' });
        }

        const conn = await database.getConnection();
        const { praticienId, date, timeSlot, symptoms } = req.body;
        
        // Ajouter une validation pour les champs requis
        if (!praticienId || !date || !timeSlot || !symptoms) {
            return res.status(400).json({
                error: 'Champs requis manquants. Veuillez fournir praticienId, date, timeSlot et symptoms'
            });
        }

        // Convertir timeSlot de "HHhMM" à "HH:MM:SS"
        const formattedTimeSlot = timeSlot
            .replace('h', ':')
            .concat(':00');

        const result = await conn.query(
            'INSERT INTO appointment (client_id, client_name, appointment_date, appointment_time, symptoms, praticien_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [clientId, clientName, date, formattedTimeSlot, JSON.stringify(symptoms), praticienId]
        );
        
        conn.release();
        
        res.status(201).json({
            message: 'Rendez-vous créé avec succès',
            appointmentId: Number(result.insertId)
        });
    } catch (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        res.status(500).json({
            error: 'Erreur interne du serveur',
            details: error.message
        });
    }
}

exports.getAppointments = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const clientId = req.user.id;

        const appointments = await conn.query(
            `SELECT a.*, p.first_name, p.last_name, p.specialties 
             FROM appointment a 
             JOIN praticien p ON a.praticien_id = p.praticien_id 
             WHERE a.client_id = ?`,
            [clientId]
        );
        
        conn.release();
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        res.status(500).send('Erreur interne du serveur');
    }
}

exports.cancelAppointment = async (req, res) => {
    try {
        const conn = await database.getConnection();
        const appointmentId = req.params.id;
        const clientId = req.user.id;

        const result = await conn.query(
            'DELETE FROM appointment WHERE appointment_id = ? AND client_id = ?',  
            [appointmentId, clientId]
        );
        
        conn.release();
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé ou non autorisé' });
        }
        
        res.status(200).json({ message: 'Rendez-vous annulé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'annulation du rendez-vous:', error);
        res.status(500).send('Erreur interne du serveur');
    }
}
