const pool = require('../config/db.config');

const checkEmailExists = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows.length > 0;
}

const createUser = async (body) => {
    const query = `
        INSERT INTO users (username, email, password, otp_code, otp_expires_at) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, username, email, is_active
    `;
    const values = [body.username, body.email, body.password, body.otp_code, body.otp_expires_at];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const activateUser = async (email) => {
    const query = `UPDATE users SET is_active = true, otp_code = NULL, otp_expires_at = NULL 
                   WHERE email = $1 
                   RETURNING id, username, email, is_active`;
    const values = [email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const updateOtp = async (email, otpCode, otpExpiresAt) => {
    const query = `UPDATE users SET otp_code = $1, otp_expires_at = $2
                   WHERE email = $3 
                   RETURNING id, username, email, is_active`;
    const values = [otpCode, otpExpiresAt, email];
    const result = await pool.query(query, values);
    return result.rows[0];
}

const getByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];

    const result = await pool.query(query, values);
    return result.rows[0];
}

const getById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0];
}

module.exports = {
    checkEmailExists,
    createUser,
    activateUser,
    getByEmail,
    getById,
    updateOtp
}