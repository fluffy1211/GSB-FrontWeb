const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.createAppointment = async (req, res) => {
    try {
        // Get user data from middleware
        const clientId = req.user.id;
        const clientName = req.user.name;

        if (!clientId) {
            return res.status(400).json({ error: 'No client_id found in token' });
        }

        const conn = await database.getConnection();
        const { praticienId, date, timeSlot, symptoms } = req.body;
        
        // Add validation for required fields
        if (!praticienId || !date || !timeSlot || !symptoms) {
            return res.status(400).json({
                error: 'Missing required fields. Please provide praticienId, date, timeSlot, and symptoms'
            });
        }

        // Convert timeSlot from "HHhMM" to "HH:MM:SS"
        const formattedTimeSlot = timeSlot
            .replace('h', ':')
            .concat(':00');

        const result = await conn.query(
            'INSERT INTO appointment (appointment_id, client_name, appointment_date, appointment_time, symptoms, praticien_id) VALUES (?, ?, ?, ?, ?, ?)', 
            [clientId, clientName, date, formattedTimeSlot, JSON.stringify(symptoms), praticienId]
        );
        
        conn.release();
        
        res.status(201).json({
            message: 'Appointment created successfully',
            appointmentId: Number(result.insertId)
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            error: 'Internal server error',
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
        console.error('Error fetching appointments:', error);
        res.status(500).send('Internal server error');
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
            return res.status(404).json({ message: 'Appointment not found or unauthorized' });
        }
        
        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).send('Internal server error');
    }
}
