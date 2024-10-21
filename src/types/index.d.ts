import { RoleType } from "@/app/actions/authActions";
import { OrderType } from "./constantsType";

type ActionResult<T> = { status: "success", data: T } | { status: "error", error: string | ZodIssue[] }

type GetMemberParams = {
    ageRange?: string;
    gender?: string;
    pageNumber?: string;
    pageSize?: string;
    orderBy?: OrderType;
    withPhoto?: string;
    role?: RoleType;
    searchParams?: UserFilters;
}

// flatten message data
type MessageDto = {
    id: string;
    text: string;
    created: string;
    dateRead: string | null;
    senderId?: string;
    senderName?: string;
    senderImage?: string | null;
    recipientId?: string;
    recipientName?: string;
    recipientImage?: string | null;
}

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
    select: {
        id: true,
        text: true,
        created: true,
        dateRead: true,
        sender: {
            select: {userId, name, image}
        },
        recipient: {
            select: {userId, name, image}
        }
    }
}>

type UserFilters = {
    ageRange: number[];
    orderBy: string;
    gender: string[];
    withPhoto: boolean;
}

type PagingParams = {
    pageNumber: number;
    pageSize: number;
}

type PagingResult = {
    totalPages: number,
    totalCount: number;
} & PagingParams;

type PaginatedResponse<T> = {
    items: T[];
    totalCount: number;
}

// type DoctorWithMemberType = Prisma.DoctorGetPayload<{
//     select: {
//         id: true,
//         field: true,
//         member: {
//             select: {
//                 id: true,
//                 userId: true,
//                 name: true,
//                 gender: true,
//                 dateOfBirth: true,
//                 created: true,
//                 updated: true,
//                 description: true,
//                 city: true,
//                 country: true,
//                 image?: true
//             }
//         }
//     }
// }>

// type MemberWithDoctorType = Prisma.MemberGetPayload<{
//     select: {
//         id: true,
//         userId: true,
//         name: true,
//         gender: true,
//         dateOfBirth: true,
//         created: true,
//         updated: true,
//         description: true,
//         city: true,
//         country: true,
//         image?: true
//         doctor: {
//             select: {
//                 id: true,
//                 field: true,
//             }
//         }
//     }
// }>

