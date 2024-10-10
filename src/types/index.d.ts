import { Prisma } from "@prisma/client"

type ActionResult<T> = { status: "success", data: T } | { status: "error", error: string | ZodIssue[] }

type DoctorWithMemberType = Prisma.DoctorGetPayload<{
    select: {
        id: true,
        field: true,
        member: {
            select: {
                id: true,
                userId: true,
                name: true,
                gender: true,
                dateOfBirth: true,
                created: true,
                updated: true,
                description: true,
                city: true,
                country: true,
                image?: true
            }
        }
    }
}>

type MemberWithDoctorType = Prisma.MemberGetPayload<{
    select: {
        id: true,
        userId: true,
        name: true,
        gender: true,
        dateOfBirth: true,
        created: true,
        updated: true,
        description: true,
        city: true,
        country: true,
        image?: true
        doctor: {
            select: {
                id: true,
                field: true,
            }
        }
    }
}>