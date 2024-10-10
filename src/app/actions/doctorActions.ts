'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { Photo } from "@prisma/client";

export async function getMemberByUserId(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'DOCTOR') return null;

    try {
        return prisma.member.findUnique({
            where: {userId},
        });
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getMemberPhotosByUserId(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'DOCTOR') return null;

    const member = await prisma.member.findUnique({
        where: {userId},
        select: {
            photos: true
        }
    })

    if (!member) return null;

    return member.photos as Photo[];
}