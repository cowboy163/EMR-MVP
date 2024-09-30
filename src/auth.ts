import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient, Role } from '@prisma/client'
import NextAuth from 'next-auth'
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { auth, handlers: { GET, POST }, signIn, signOut } = NextAuth({
    callbacks: {
        async jwt({ user, token }) {
            if (user) {
                token.profileComplete = user.profileComplete;
                token.role = user.role;
            }
            return token;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.profileComplete = token.profileComplete as boolean;
                session.user.role = token.role as Role;
            }
            return session
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig
})