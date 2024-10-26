'use server'
import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";
import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/memberEditSchema";
import { ActionResult } from "@/types";
import { Member, Photo } from "@prisma/client";
import { cloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";

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

async function updateSelfProfile(data: MemberEditSchema, nameUpdated: boolean, userId: string | undefined): Promise<ActionResult<Member>> {
    try {
        const validated = memberEditSchema.safeParse(data)
        if (!validated.success) return { status: 'error', error: validated.error.errors }

        const { name, description, city, country } = validated.data

        if (nameUpdated) {
            await prisma.user.update({
                where: { id: userId },
                data: { name }
            })
        }

        const member = await prisma.member.update({
            where: { userId },
            data: {
                name,
                description,
                city,
                country
            }
        })

        return { status: 'success', data: member }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

export async function updateMemberProfile(data: MemberEditSchema, nameUpdated: boolean, targetId?: string): Promise<ActionResult<Member>> {
    try {
        const session = await auth();
        const { id: userId, role } = session?.user || {};
        const editSelf = !targetId;
        if (editSelf) {
            return updateSelfProfile(data, nameUpdated, userId);
        } else {
            switch (role) {
                case "ADMIN":
                    return updateOtherMemberProfileByAdmin(data, targetId)

                default:
                    throw new Error("Role is undefined in updateMemberProfile")
            }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

async function addSelfImage(url: string, publicId: string, userId: string) {
    try {
        return prisma.member.update({
            where: { userId },
            data: {
                photos: {
                    create: [
                        {
                            url,
                            publicId
                        }
                    ]
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}



export async function addImage(url: string, publicId: string, targetId?: string) {
    try {
        const session = await auth();
        const { id: userId, role } = session?.user || {};
        if (!userId) throw new Error("No permission to add image");
        const editSelf = !targetId;
        if (editSelf) {
            return addSelfImage(url, publicId, userId);
        } else {
            switch (role) {
                case "ADMIN":
                    return addImageByAdmin(url, publicId, targetId)

                default:
                    throw new Error("No permission to add image")
            }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

async function deleteSelfImage(photo: Photo, userId: string) {
    try {
        if (photo.publicId) {
            await cloudinary.v2.uploader.destroy(photo.publicId);
        }

        return prisma.member.update({
            where: { userId },
            data: {
                photos: {
                    delete: { id: photo.id }
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteImage(photo: Photo, targetId?: string) {
    try {
        const session = await auth();
        const { id: userId, role } = session?.user || {};
        if (!userId) throw new Error("No permission to delete image");
        const editSelf = !targetId;
        if (editSelf) {
            return deleteSelfImage(photo, userId);
        } else {
            switch (role) {
                case "ADMIN":
                    return deleteImageByAdmin(photo, targetId)

                default:
                    throw new Error("No permission to delete image")
            }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

async function setSelfMainImage(photo: Photo, userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { image: photo.url }
        })

        return prisma.member.update({
            where: { userId },
            data: { image: photo.url }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function setMainImage(photo: Photo, targetId?: string) {
    try {
        const session = await auth();
        const { id: userId, role } = session?.user || {};
        if (!userId) throw new Error("No permission to set main image");
        const editSelf = !targetId;
        if (editSelf) {
            return setSelfMainImage(photo, userId);
        } else {
            switch (role) {
                case "ADMIN":
                    return setMainImageByAdmin(photo, targetId)

                default:
                    throw new Error("No permission to set main image")
            }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

// admin use only, dev only
export async function deleteUser(userId: string) {
    try {
        await prisma.$transaction(async tx => {
            await tx.user.deleteMany({ where: { id: userId } })
        });
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
}

async function updateOtherMemberProfileByAdmin(data: MemberEditSchema, targetId: string | undefined): Promise<ActionResult<Member>> {
    try {
        if (!targetId) throw new Error("targetId is undefined in updateOtherMemberProfileForAdmin");
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

async function addImageByAdmin(url: string, publicId: string, targetId: string) {
    try {
        return prisma.member.update({
            where: { userId: targetId },
            data: {
                photos: {
                    create: [
                        {
                            url,
                            publicId
                        }
                    ]
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function setMainImageByAdmin(photo: Photo, targetId: string) {
    try {
        await prisma.user.update({
            where: { id: targetId },
            data: { image: photo.url }
        })

        return prisma.member.update({
            where: { userId: targetId },
            data: { image: photo.url }
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function deleteImageByAdmin(photo: Photo, targetId: string) {
    try {
        if (photo.publicId) {
            await cloudinary.v2.uploader.destroy(photo.publicId);
        }

        return prisma.member.update({
            where: { userId:targetId },
            data: {
                photos: {
                    delete: { id: photo.id }
                }
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

