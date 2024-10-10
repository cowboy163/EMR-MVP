'use server'

import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma"
import { LoginSchema } from "@/lib/schemas/loginSchema";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { ActionResult } from "@/types";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth";

export type RoleType = 'DOCTOR' | 'PATIENT'

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

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })
        console.log(result)
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

export async function registerUser(data: RegisterSchema, rolePlatform: RoleType = 'PATIENT'): Promise<ActionResult<User>> {
    try {
        const validated = registerSchema.safeParse(data);

        if (!validated.success) {
            return { status: "error", error: validated.error.errors }
        }

        const { name, email, password } = validated.data;

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) return { status: "error", error: "User already exist" }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hashedPassword,
                role: rolePlatform
            }
        })

        return { status: "success", data: user }
    } catch (error) {
        console.log(error)
        return { status: 'error', error: "Something went wrong" }
    }

}

export async function signOutUser() {
    await signOut({
        redirectTo: '/'
    });
}