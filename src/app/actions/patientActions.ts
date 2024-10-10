'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";
import { Photo } from "@prisma/client";


export async function getMemberSelf() {
    try {
        const session = await auth();
        if (!session) throw new Error("Need Login");
        return prisma.member.findUnique({
            where: { userId: session?.user.id }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMemberDoctors() {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PATIENT') return null;

    try {
        return prisma.member.findMany({
            where: { role: 'DOCTOR' }
        });
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMemberDoctorByUserId(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PATIENT') return null;

    try {
        return prisma.member.findUnique({
            where: { userId, role: 'DOCTOR' },
        });
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function getMemberDoctorPhotosByUserId(userId: string) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PATIENT') return null;

    const doctor = await prisma.member.findUnique({
        where: { userId, role: 'DOCTOR' },
        select: {
            photos: true
        }
    })

    if (!doctor) return null;

    return doctor.photos as Photo[];
}