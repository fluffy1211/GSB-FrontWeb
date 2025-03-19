const jwt = require('jsonwebtoken');
const database = require('../database/db.js');

exports.addProduct = async (req, res) => {
    const { name, description, price, imagePath, quantity } = req.body;

    if (!name || !description || !price || !imagePath || !quantity) {
        return res.status(400).json({ error: 'Remplissez tous les champs' });
    }

    try {
        const conn = await database.getConnection();
        const query = 'INSERT INTO products (name, description, price, imagePath, quantity) VALUES (?, ?, ?, ?, ?)';
        await conn.query(query, [name, description, price, imagePath, quantity]);
        conn.release();
        res.status(201).json({ message: 'produit bien ajouté' });
    } catch (error) {
        console.error("Erreur dans l'ajout", error);
        res.status(500).json({ error: 'Erreur' });
    }
};

exports.addPraticien = async (req, res) => {
    console.log('Received request to add praticien:', req.body);
    const { first_name, last_name, specialties, avatarPath } = req.body;

    if (!first_name || !last_name || !specialties) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'First name, last name, and specialties are required' });
    }

    try {
        console.log('Connecting to database...');
        const conn = await database.getConnection();
        
        console.log('Inserting new praticien with data:', { first_name, last_name, specialties, avatarPath });
        const query = 'INSERT INTO praticien (first_name, last_name, specialties, avatarPath) VALUES (?, ?, ?, ?)';
        const result = await conn.query(query, [first_name, last_name, specialties, avatarPath]);
        
        // Convert BigInt to string to avoid serialization issues
        const insertId = result.insertId ? result.insertId.toString() : null;
        console.log('Praticien added successfully, ID:', insertId);
        conn.release();
        
        res.status(201).json({ 
            message: 'Praticien added successfully',
            praticienId: insertId 
        });
    } catch (error) {
        console.error("Error adding praticien:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.removePraticien = async (req, res) => {
    const praticienId = req.params.id;
    console.log(`Received request to remove praticien with ID: ${praticienId}`);

    if (!praticienId) {
        console.log('Validation failed: Missing praticien ID');
        return res.status(400).json({ error: 'Praticien ID is required' });
    }

    try {
        console.log('Connecting to database...');
        const conn = await database.getConnection();
        
        // First check if the praticien exists
        console.log(`Checking if praticien with ID ${praticienId} exists`);
        const checkResult = await conn.query('SELECT * FROM praticien WHERE praticien_id = ?', [praticienId]);
        
        if (!checkResult || checkResult.length === 0) {
            console.log(`Praticien with ID ${praticienId} not found`);
            conn.release();
            return res.status(404).json({ error: 'Praticien not found' });
        }
        
        // Check if the praticien has associated appointments (for logging purposes)
        console.log(`Checking if praticien with ID ${praticienId} has appointments`);
        const appointmentCheck = await conn.query(
            'SELECT COUNT(*) as appointmentCount FROM appointment WHERE praticien_id = ?', 
            [praticienId]
        );
        
        // Convert BigInt to Number to avoid serialization issues
        const appointmentCount = Number(appointmentCheck[0].appointmentCount);
        console.log(`Found ${appointmentCount} appointments for praticien ID ${praticienId}`);
        
        // Use a transaction to ensure both operations succeed or fail together
        try {
            await conn.beginTransaction();
            
            // Delete associated appointments first
            if (appointmentCount > 0) {
                console.log(`Deleting ${appointmentCount} appointments for praticien ID ${praticienId}`);
                const deleteAppointmentsResult = await conn.query(
                    'DELETE FROM appointment WHERE praticien_id = ?', 
                    [praticienId]
                );
                // Convert BigInt to Number
                const deletedAppointments = Number(deleteAppointmentsResult.affectedRows);
                console.log(`Deleted ${deletedAppointments} appointments`);
            }
            
            // Now delete the praticien
            console.log(`Deleting praticien with ID ${praticienId}`);
            const deletePraticienResult = await conn.query(
                'DELETE FROM praticien WHERE praticien_id = ?', 
                [praticienId]
            );
            
            // Convert BigInt to Number in the log
            const affectedRows = Number(deletePraticienResult.affectedRows);
            const warningStatus = Number(deletePraticienResult.warningStatus || 0);
            
            console.log(`Praticien deletion result:`, {
                affectedRows: affectedRows,
                warningStatus: warningStatus
            });
            
            if (affectedRows === 0) {
                // Unlikely since we already checked if the praticien exists
                await conn.rollback();
                conn.release();
                return res.status(404).json({ error: 'Praticien not found or could not be deleted' });
            }
            
            // If we get here, everything succeeded - commit the transaction
            await conn.commit();
            
            res.status(200).json({ 
                message: 'Praticien removed successfully',
                appointmentsRemoved: appointmentCount
            });
            
        } catch (transactionError) {
            // If anything fails, roll back the transaction
            console.error("Transaction error:", transactionError);
            await conn.rollback();
            throw transactionError; // Re-throw to be caught by the outer catch block
        } finally {
            conn.release();
        }
        
    } catch (error) {
        console.error("Error removing praticien:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.removeProduct = async (req, res) => {
    const productId = req.params.id;
    console.log(`Received request to remove product with ID: ${productId}`);

    if (!productId) {
        console.log('Validation failed: Missing product ID');
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        console.log('Connecting to database...');
        const conn = await database.getConnection();
        
        // First check if the product exists
        console.log(`Checking if product with ID ${productId} exists`);
        const checkResult = await conn.query('SELECT * FROM products WHERE id_product = ?', [productId]);
        
        if (!checkResult || checkResult.length === 0) {
            console.log(`Product with ID ${productId} not found`);
            conn.release();
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Delete the product
        console.log(`Deleting product with ID ${productId}`);
        const deleteProductResult = await conn.query(
            'DELETE FROM products WHERE id_product = ?', 
            [productId]
        );
        
        const affectedRows = Number(deleteProductResult.affectedRows);
        console.log(`Product deletion result: ${affectedRows} rows affected`);
        
        if (affectedRows === 0) {
            conn.release();
            return res.status(404).json({ error: 'Product could not be deleted' });
        }
        
        conn.release();
        res.status(200).json({ 
            message: 'Product removed successfully'
        });
        
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ error: 'Server error' });
    }
};