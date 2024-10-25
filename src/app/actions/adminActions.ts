import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/memberEditSchema";
import { ActionResult } from "@/types";
import { Member } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const permissionCheck = async () => {
    const session = await auth();
    return session?.user.role === 'ADMIN';
}

// user action
export async function updateOhterMemberProfileForAdmin(data: MemberEditSchema, targetId: string): Promise<ActionResult<Member>> {
    try {
        const permission = await permissionCheck();
        if (!permission) return { status: "error", error: "Permission denied" };
        const validated = memberEditSchema.safeParse(data)
        if (!validated.success) return { status: 'error', error: validated.error.errors }

        const { name, description, city, country } = validated.data
        const member = await prisma.member.update({
            where: { userId: targetId },
            data: {
                name,
                description,
                city,
                country
            }
        })
        return { status: 'success', data: member }

    } catch (error) {
        console.error(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}