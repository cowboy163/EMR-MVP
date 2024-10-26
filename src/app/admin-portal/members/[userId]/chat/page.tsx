import { getAuthUserId } from '@/app/actions/authActions';
import { getMessageThread } from '@/app/actions/messageActions'
import ChatForm from '@/components/forms/ChatForm';
import MessageList from '@/components/message/MessageList';
import CardInnerWrapper from '@/components/wrappers/CardInnerWrapper'
import { createChatId } from '@/lib/util';
import React from 'react'

export default async function AdminChatPage({ params }: { params: { userId: string } }) {
    const userId = await getAuthUserId();
    const messages = await getMessageThread(params.userId);
    const chatId = createChatId(userId, params.userId)
    return (
        <CardInnerWrapper
            header={'Chat'}
            body={<MessageList initialMessages={messages} currentUserId={userId} chatId={chatId} />}
            footer={<ChatForm />}
        />
    )
}
