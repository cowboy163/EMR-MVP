'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult, MessageDto } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { mapMessageToMessageDto } from "@/lib/mappings";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/util";
import { EVENT_ID_TYPES, EVENT_TYPES } from "@/types/eventTypes";

const messageSelect = {
    id: true,
    text: true,
    created: true,
    dateRead: true,
    sender: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    },
    recipient: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    }
}

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
    try {
        const userId = await getAuthUserId();

        const validated = messageSchema.safeParse(data);

        if (!validated.success) return { status: 'error', error: validated.error.errors }

        const { text } = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            },
            select: messageSelect
        });

        const messageDto = mapMessageToMessageDto(message);
        await pusherServer.trigger(createChatId(userId, recipientUserId), EVENT_TYPES.NEW_MESSAGE, messageDto);
        // push message to private channel
        await pusherServer.trigger(`${EVENT_ID_TYPES.PRIVATE}-${recipientUserId}`, EVENT_TYPES.NEW_MESSAGE, messageDto);
        return { status: 'success', data: messageDto }
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const userId = await getAuthUserId();

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        recipientId,
                        senderDeleted: false
                    },
                    {
                        senderId: recipientId,
                        recipientId: userId,
                        recipientDeleted: false
                    }
                ]
            },
            orderBy: {
                created: 'asc'
            },
            select: messageSelect
        })

        let readCount = 0;
        // 1. when get message thread, change all message to readed 
        // 2. find unread message that recipient is user, and sender is someone else
        if (messages.length > 0) {
            const readMessageIds = messages.filter(m => m.dateRead === null
                && m.recipient?.userId === userId
                && m.sender?.userId === recipientId
            ).map(m => m.id)
            await prisma.message.updateMany({
                where: { id: { in: readMessageIds } },
                data: { dateRead: new Date() }
            })

            readCount = readMessageIds.length;

            await pusherServer.trigger(createChatId(recipientId, userId), EVENT_TYPES.READ_MESSAGE, readMessageIds);
        }

        const messagesToReturn = messages.map(message => mapMessageToMessageDto(message));

        return { messages: messagesToReturn, readCount }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getMessagesByContainer(container?: string | null, cursor?: string, limit = 10) {
    try {
        const userId = await getAuthUserId();

        // if message has been deleted, don't get it
        const conditions = {
            [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
            ...(container === 'outbox' ? { senderDeleted: false } : { recipientDeleted: false })
        }

        const messages = await prisma.message.findMany({
            // condition to get data: get data from cursor to limit + 1 if there is sursor
            // limit + 1 is for return the last data as new cursor
            where: {
                ...conditions,
                ...(cursor ? { created: { lte: new Date(cursor) } } : {})
            },
            orderBy: {
                created: 'desc'
            },
            select: messageSelect,
            take: limit + 1,
        });

        let nextCursor: string | undefined;

        // if the data geted more than the limit, return last items as next cursor
        // else, next cursor is undefined
        if (messages.length > limit) {
            const nextItem = messages.pop();
            nextCursor = nextItem?.created.toISOString();
        } else {
            nextCursor = undefined;
        }

        const messagesToReturn = messages.map(message => mapMessageToMessageDto(message));
        return { messages: messagesToReturn, nextCursor }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

    try {
        const userId = await getAuthUserId();

        await prisma.message.update({
            where: { id: messageId },
            data: {
                [selector]: true
            }
        })

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })

        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUnreadMessageCount() {
    try {
        const userId = await getAuthUserId();

        return prisma.message.count({
            where: {
                recipientId: userId,
                dateRead: null,
                recipientDeleted: false
            }
        })
    } catch (error) {
        console.log(error);
        throw (error);
    }
}