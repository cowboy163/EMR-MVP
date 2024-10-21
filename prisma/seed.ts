import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { doctorsData, patientsData } from "./membersData";
import { RoleType } from "@/types/constantsType";

export type SeedMemberDataType = {
    email: string,
    username: string,
    gender: string,
    dateOfBirth: string,
    name: string,
    created: string,
    lastActive: string,
    description: string,
    city: string,
    country: string,
    image: string
}

const prisma = new PrismaClient();

async function insertSeedMembersData(data: SeedMemberDataType[], role: RoleType) {
    return data.map(async member => prisma.user.create({
        data: {
            email: member.email,
            emailVerified: new Date(),
            name: member.name,
            passwordHash: await hash('password', 10),
            image: member.image,
            role,
            member: {
                create: {
                    dateOfBirth: new Date(member.dateOfBirth),
                    gender: member.gender,
                    name: member.name,
                    created: new Date(member.created),
                    updated: new Date(member.lastActive),
                    description: member.description,
                    city: member.city,
                    country: member.country,
                    image: member.image,
                    role,
                    photos: {
                        create: {
                            url: member.image
                        }
                    },
                    doctor: role === 'DOCTOR' ? {
                        create: {
                            field: "Eye Care",
                            user: {
                                connect: { email: member.email }
                            }
                        }
                    } : undefined,
                    patient: role === 'PATIENT' ? {
                        create: {
                            medicalHistory: "Red eye",
                            user: {
                                connect: { email: member.email }
                            }
                        }
                    } : undefined
                }
            },
        }
    }))
}

async function main() {
    if (process.env.RUN_SEED === 'true' || process.env.NODE_ENV === 'development') {
        await insertSeedMembersData(patientsData, 'PATIENT');
        await insertSeedMembersData(doctorsData, 'DOCTOR');
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})