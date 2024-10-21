'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GetMemberParams, PaginatedResponse } from "@/types";
import { getAuthUserId } from "./authActions";
import { Member, Photo } from "@prisma/client";
import { addYears } from "date-fns";
import { RoleType } from "@/types/constantsType";

export async function getMembers({
    role,
    ageRange = '0,100',
    gender = 'male,female',
    orderBy = 'updated',
    pageNumber = '1',
    pageSize = '12',
    withPhoto = 'true'
}: GetMemberParams): Promise<PaginatedResponse<Member>> {
    const userId = await getAuthUserId();

    const [minAge, maxAge] = ageRange.split(',');
    const currentDate = new Date();

    // for age period
    // get the lowest date of birth
    const minDob = addYears(currentDate, -maxAge - 1);
    // get the highest date of birth
    const maxDob = addYears(currentDate, -minAge);
    // for gender filter
    const selectedGender = gender.split(',');

    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);
    const skip = (page - 1) * limit;

    try {
        const count = await prisma.member.count({
            where: {
                ...(role && { role }),
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    { gender: { in: selectedGender } },
                    ...(withPhoto === 'true'? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                },
            },
        });

        const members = await prisma.member.findMany({
            where: {
                ...(role && { role }),
                AND: [
                    { dateOfBirth: { gte: minDob } },
                    { dateOfBirth: { lte: maxDob } },
                    { gender: { in: selectedGender } },
                    ...(withPhoto === 'true'? [{image: {not: null}}] : [])
                ],
                NOT: {
                    userId
                },
            },
            orderBy: {
                [orderBy]: 'desc'
            },
            skip,
            take: limit
        });
        return {
            items: members,
            totalCount: count
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMemberByUserId({ userId, role }: { userId: string, role?: RoleType }) {
    const session = await auth();
    if (!session?.user) return null;

    try {
        return prisma.member.findUnique({
            where: {
                userId,
                ...(role && { role })
            }
        });
    } catch (error) {
        console.log(error)
    }
}

export async function getMemberPhotosByUserId({ userId, role }: { userId: string, role?: RoleType }) {
    const currentUserId = await getAuthUserId();
    if (!currentUserId) {
        throw new Error('No Permission')
    }

    const doctor = await prisma.member.findUnique({
        where: {
            userId,
            ...(role && { role })
        },
        select: {
            photos: true
        }
    })

    if (!doctor) return null;

    return doctor.photos as Photo[];
}

// user online status will update their last active, use it in usePresenceChannel
export async function updateLastActive() {
    const userId = await getAuthUserId();

    try {
        return prisma.member.update({
            where: { userId },
            data: { updated: new Date() }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}