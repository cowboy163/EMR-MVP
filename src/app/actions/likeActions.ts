'use server'

import { prisma } from "@/lib/prisma";
import { getAuthUserId } from "./authActions";
import { pusherServer } from "@/lib/pusher";
import { EVENT_ID_TYPES, EVENT_TYPES } from "@/types/eventTypes";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
    try {
        const userId = await getAuthUserId()
        if (isLiked) {
            await prisma.like.delete({
                where: {
                    sourceUserId_targetUserId: {
                        sourceUserId: userId,
                        targetUserId
                    }
                }
            })
        } else {
            const like = await prisma.like.create({
                data: {
                    sourceUserId: userId,
                    targetUserId
                },
                select: {
                    sourceMember: {
                        select: {
                            name: true,
                            image: true,
                            userId: true,
                        }
                    }
                }
            });
            // for real-time toggle like use
            await pusherServer.trigger(`${EVENT_ID_TYPES.PRIVATE}-${targetUserId}`, EVENT_TYPES.NEW_LIKE, {
                name: like.sourceMember.name,
                image: like.sourceMember.image,
                userId: like.sourceMember.userId
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function fetchCurrentUserLikeIds() {
    try {
        const userId = await getAuthUserId();

        const likeIds = await prisma.like.findMany({
            where: {
                sourceUserId: userId
            },
            select: {
                targetUserId: true
            }
        })
        return likeIds.map(like => like.targetUserId);
    } catch (error) {
        console.log(error)
        throw error
    }
}

async function fetchSourceLikes(userId: string) {
    const sourceList = await prisma.like.findMany({
        where: { sourceUserId: userId },
        select: {
            targetMember: {
                include: {
                    doctor: true
                }
            }
        }
    })
    return sourceList.map(x => x.targetMember);
}

async function fetchTargetLikes(userId: string) {
    const targetList = await prisma.like.findMany({
        where: { targetUserId: userId },
        select: {
            sourceMember: {
                include: {
                    doctor: true
                }
            }
        }
    })
    return targetList.map(x => x.sourceMember)
}

async function fetchMutualLikes(userId: string) {
    const likedUsers = await prisma.like.findMany({
        where: { sourceUserId: userId },
        select: { targetUserId: true }
    });
    const likedId = likedUsers.map(x => x.targetUserId);

    const mutualList = await prisma.like.findMany({
        where: {
            AND: [
                { targetUserId: userId },
                { sourceUserId: { in: likedId } }
            ]
        },
        select: {
            sourceMember: {
                include: {
                    doctor: true
                }
            }
        }
    })

    return mutualList.map(x => x.sourceMember);
}

export async function fetchLikedMembers(type = 'source') {
    try {
        const userId = await getAuthUserId();

        switch (type) {
            case 'source':
                return await fetchSourceLikes(userId);

            case 'target':
                return await fetchTargetLikes(userId);

            case 'mutual':
                return await fetchMutualLikes(userId);

            default:
                return [];
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}