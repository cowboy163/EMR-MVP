import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// email verification service
export async function sendVerificationEmail(email: string, token: string) {
    const link = `${baseUrl}/verify-email?token=${token}`
    if (!process.env.RESEND_FROM_EMAIL || typeof process.env.RESEND_FROM_EMAIL !== 'string') throw new Error("There is error to get RESEND_FROM_EMAIL in env")
    return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Verify your email address',
        html: `
            <h1>Verify your email address</h1>
            <p>Click the link below to verify your email address</p>
            <a href="${link}">Verify email</a>
        `
    })
}

// forgot password service
export async function sendPasswordResetEmail(email: string, token: string) {
    const link = `${baseUrl}/reset-password?token=${token}`
    if (!process.env.RESEND_FROM_EMAIL || typeof process.env.RESEND_FROM_EMAIL !== 'string') throw new Error("There is error to get RESEND_FROM_EMAIL in env")

    return resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: email,
        subject: 'Reset your password',
        html: `
            <h1>You have requested to reset your password</h1>
            <p>Click the link below to reset password</p>
            <a href="${link}">Reset password</a>
        `
    })
}
