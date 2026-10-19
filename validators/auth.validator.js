const { z } = require('zod');

const registerSchema = z.object({
    username: z.string()
        .min(1, 'Username is required'),
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string()
        .min(1, 'Confirm Password is required')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const verifyOtpSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    otp_code: z.string()
        .min(1, 'OTP code is required')
        .length(6, 'OTP code must be 6 characters long'),
});

const resendOtpSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
});

const loginSchema = z.object({
    email: z.string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .min(6, 'Password must be at least 6 characters long'),
});

module.exports = {
    registerSchema,
    verifyOtpSchema,
    resendOtpSchema,
    loginSchema
}