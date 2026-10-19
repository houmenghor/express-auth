const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const newUser = await authService.register(req.validate);

        return res.status(201).json({
            status: 'success',
            message: 'Registered successfully. Please check your email for the OTP.',
            data: newUser
        });
    } catch (error) {
        const statusCode = error.message.includes('already') ? 409 : 500
        return res.status(statusCode).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const {email, otp_code} = req.validate;
        const data = await authService.verifyOtp(email, otp_code);

        return res.status(200).json({
            status: 'success',
            message: 'OTP verified successfully. Your account is now active.',
            data: data
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}

const resendOtp = async (req, res) => {
    try {
        const {email} = req.validate;
        const data = await authService.resendOtp(email);
        
        return res.status(200).json({
            status: 'success',
            message: 'A new OTP has been sent to your email. Please check your inbox.',
            data: data
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.validate;
        const data = await authService.login(email, password);

        return res.status(200).json({
            status: 'success',
            message: 'Logged in successfully',
            data: data
        });
    } catch (error) {
        const statusCode = error.message.includes('not verified') ? 403 : 401;
        return res.status(statusCode).json({
            status: 'error',
            // message: 'Invalid email or password',
            error: error.message
        })
    }
}

const getProfile = async (req, res) => {
    try {
        console.log("Decoded Token Data:", req.user);
        const userProfile = await authService.getProfile(req.user.userId);
        return res.status(200).json({
            status: 'success',
            message: 'User profile retrieved successfully',
            data: userProfile
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    login,
    getProfile
}