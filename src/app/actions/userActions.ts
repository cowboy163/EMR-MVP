import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";

export async function getUserInfoForNav() {
    try {
        const userId = await getAuthUserId();
        return prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, image: true }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}