'use server'

import { auth, signIn, signOut } from "@/auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma"
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { DoctorProfileSchema, doctorRegisterSchema, DoctorRegisterSchema, PatientProfileSchema, patientRegisterSchema, PatientRegisterSchema } from "@/lib/schemas/registerSchema";
import { generateToken, getTokenByToken } from "@/lib/tokens";
import { ActionResult } from "@/types";
import { RoleType } from "@/types/constantsType";
import { TokenType, User } from "@prisma/client";
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth";

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email }
    })
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id }
    })
}

export async function getAuthUserId() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error('Unauthorised')
    return userId
}

export async function signInUser(data: LoginSchema, rolePlatform: RoleType = 'PATIENT'): Promise<ActionResult<string>> {
    try {
        const existingUser = await getUserByEmail(data.email);

        const isInvalidUser = !existingUser || !existingUser.email;
        const isInvalidRole = rolePlatform !== existingUser?.role

        if (isInvalidUser || isInvalidRole) return { status: 'error', error: 'Invalid credentials' }

        // check if email has been verified
        if (!existingUser.emailVerified && process.env.RESEND_EMAIL_VERIFICATION_SERVICE === "true") {
            const token = await generateToken(existingUser.email!, TokenType.VERIFICATION);

            // send email
            await sendVerificationEmail(token.email, token.token)

            return { status: 'error', error: 'Please verify your email address before logging in' };
        }

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })

        if (process.env.NODE_ENV !== 'production') {
            console.log(result)
        }
        return { status: "success", data: "Loged in" }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { status: 'error', error: 'Invalid credentials' }
                case 'CallbackRouteError':
                    return { status: 'error', error: 'Invalid credentials' }
                default:
                    return { status: 'error', error: 'Something went wrong' }
            }
        } else {
            return { status: 'error', error: 'Something else went wrong' }
        }
    }
}

async function registerPatient(data: PatientRegisterSchema): Promise<ActionResult<User>> {
    try {
        const validated = patientRegisterSchema.safeParse(data);

        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password, gender, description, dateOfBirth, city, country, medicalHistory } = validated.data;
        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) return { status: "error", error: "User already exist" };

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: 'PATIENT',
                profileComplete: true,
                member: {
                    create: {
                        name,
                        description,
                        city,
                        country,
                        dateOfBirth: new Date(dateOfBirth),
                        gender,
                        role: 'PATIENT',
                        patient: {
                            create: {
                                medicalHistory,
                                user: {
                                    connect: { email }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (process.env.RESEND_EMAIL_VERIFICATION_SERVICE === "true") {
            const verificationToken = await generateToken(email, TokenType.VERIFICATION);
            // Send email
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
        }

        return { status: 'success', data: user }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: "Something went wrong" };
    }
}

async function registerDoctor(data: DoctorRegisterSchema): Promise<ActionResult<User>> {
    try {
        const validated = doctorRegisterSchema.safeParse(data);

        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password, gender, description, dateOfBirth, city, country, field } = validated.data;
        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) return { status: "error", error: "User already exist" };

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: 'DOCTOR',
                profileComplete: true,
                member: {
                    create: {
                        name,
                        description,
                        city,
                        country,
                        dateOfBirth: new Date(dateOfBirth),
                        gender,
                        role: 'DOCTOR',
                        doctor: {
                            create: {
                                field,
                                user: {
                                    connect: { email }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (process.env.RESEND_EMAIL_VERIFICATION_SERVICE === "true") {
            const verificationToken = await generateToken(email, TokenType.VERIFICATION);
            // Send email
            await sendVerificationEmail(verificationToken.email, verificationToken.token);
        }
        return { status: 'success', data: user }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: "Something went wrong" };
    }
}

export async function registerUser(data: PatientRegisterSchema | DoctorRegisterSchema, rolePlatform: RoleType = 'PATIENT'): Promise<ActionResult<User>> {
    switch (rolePlatform) {
        case "DOCTOR":
            return registerDoctor(data as DoctorRegisterSchema);
        case "PATIENT":
            return registerPatient(data as PatientRegisterSchema);
        default:
            console.log("rolePlatform is undefined in registerUser");
            return { status: 'error', error: "Something went wrong" };
    }
}

export async function signOutUser() {
    await signOut({
        redirectTo: '/'
    });
}

export async function verifyEmail(token: string): Promise<ActionResult<string>> {
    try {
        const existingToken = await getTokenByToken(token);

        if (!existingToken) {
            return { status: 'error', error: 'Invalid token' }
        }

        const hasExpired = new Date() > existingToken.expires;
        if (hasExpired) {
            return { status: 'error', error: 'Token has expired' }
        }

        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return { status: 'error', error: 'User not found' }
        }

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() }
        });

        await prisma.token.delete({ where: { id: existingToken.id } })

        return { status: 'success', data: 'Success' }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>> {
    try {
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return { status: 'error', error: 'Email not found' }
        }

        const token = await generateToken(email, TokenType.PASSWORD_RESET);

        await sendPasswordResetEmail(token.email, token.token);

        return { status: 'success', data: 'Password reset email has been sent. Please check your email.' }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' };
    }
}

export async function resetPassword(password: string, token: string | null): Promise<ActionResult<string>> {
    try {
        if (!token) return { status: 'error', error: 'Missing token' };

        const existingToken = await getTokenByToken(token);

        if (!existingToken) {
            return { status: 'error', error: 'Invalid token' }
        }

        const hasExpired = new Date() > existingToken.expires;
        if (hasExpired) {
            return { status: 'error', error: 'Token has expired' }
        }

        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return { status: 'error', error: 'User not found' }
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { passwordHash: hashedPassword }
        });

        await prisma.token.delete({ where: { id: existingToken.id } })

        return { status: 'success', data: 'Password updated successfully. Please try logging in' }

    } catch (error) {
        console.log(error)
        return { status: 'error', error: 'Some went wrong' }
    }
}

async function completePatientSocialLoginProfile(data: PatientProfileSchema): Promise<ActionResult<string>> {
    try {
        const session = await auth();
        if (!session?.user) return { status: 'error', error: 'User not found' }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                profileComplete: true,
                role: "PATIENT",
                member: {
                    create: {
                        name: session.user.name as string,
                        image: session.user.image as string,
                        gender: data.gender,
                        dateOfBirth: new Date(data.dateOfBirth),
                        description: data.description,
                        city: data.city,
                        country: data.country,
                        role: 'PATIENT',
                        patient: {
                            create: {
                                medicalHistory: data.medicalHistory,
                                user: {
                                    connect: { email: session.user.email as string }
                                }
                            }
                        }
                    }
                }
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })

        return { status: 'success', data: user.accounts[0].provider }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function completeDoctorSocialLoginProfile(data: DoctorProfileSchema): Promise<ActionResult<string>> {
    try {
        const session = await auth();
        if (!session?.user) return { status: 'error', error: 'User not found' }

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                profileComplete: true,
                role: "DOCTOR",
                member: {
                    create: {
                        name: session.user.name as string,
                        image: session.user.image as string,
                        gender: data.gender,
                        dateOfBirth: new Date(data.dateOfBirth),
                        description: data.description,
                        city: data.city,
                        country: data.country,
                        role: 'DOCTOR',
                        doctor: {
                            create: {
                                field: data.field,
                                user: {
                                    connect: { email: session.user.email as string }
                                }
                            }
                        }
                    }
                }
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })

        return { status: 'success', data: user.accounts[0].provider }

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function completeSocialLoginProfile(data: PatientProfileSchema | DoctorProfileSchema, rolePlatform: RoleType): Promise<ActionResult<string>> {
    switch (rolePlatform) {
        case 'DOCTOR':
            return completeDoctorSocialLoginProfile(data as DoctorProfileSchema);
        case 'PATIENT':
            return completePatientSocialLoginProfile(data as PatientProfileSchema);
        default:
            console.log("rolePlatform is undefined in completeSocialLoginProfile");
            return { status: 'error', error: "Something went wrong" };
    }
}