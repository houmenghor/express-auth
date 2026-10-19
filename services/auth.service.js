const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const jwtConfig = require('../config/jwt.config');
const userModel = require('../models/user.model');
const mailService = require('../services/mail.service');

const generateOTP = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++)
        otp += characters.charAt(crypto.randomInt(characters.length));
    return otp;
};

const register = async (body) => {
    // check if email already exists
    const checkEmail = await userModel.checkEmailExists(body.email);
    if (checkEmail) {
        throw new Error('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = await userModel.createUser({
        username: body.username,
        email: body.email,
        password: hashedPassword,
        otp_code: otpCode,
        otp_expires_at: otpExpiresAt
    });

    await mailService.sendOtpEmail(body.email, body.username, otpCode);
    return user;
};

const verifyOtp = async (email, otpCode) => {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
        throw new Error('User with this email does not exist');
    }
    if (user.is_active) {
        throw new Error('User is already active');
    }
    if (user.otp_code !== otpCode) {
        throw new Error('Invalid OTP code');
    }

    if (new Date() > new Date(user.otp_expires_at)) {
        throw new Error('OTP code has expired. Please request a new one.');
    }

    return await userModel.activateUser(email);
}

const resendOtp = async (email) => {
    const user = await userModel.getByEmail(email);
    if (!user) {
        throw new Error('User with this email does not exist');
    }
    if (user.is_active) {
        throw new Error('User is already active');
    }

    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await userModel.updateOtp(email, otpCode, otpExpiresAt);
    await mailService.sendOtpEmail(email, user.username, otpCode);
};

const login = async (email, password) => {
    // find user by email
    const user = await userModel.getByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    if (!user.is_active) {
        const otpCode = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        await userModel.updateOtp(email, otpCode, otpExpiresAt);
        await mailService.sendOtpEmail(email, user.username, otpCode);
        throw new Error('Account is not active. Please verify your email.');
    }



    const token = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        jwtConfig.secret,
        {
            expiresIn: jwtConfig.expiresIn
        }
    )

    delete user.password;
    delete user.otp_code;
    delete user.otp_expires_at;

    return {
        user,
        token
    };
}

const getProfile = async (userId) => {
    const user = await userModel.getById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    delete user.password;
    delete user.otp_code;
    delete user.otp_expires_at;

    return user;
}

module.exports = {
    register,
    verifyOtp,
    resendOtp,
    getProfile,
    login
}