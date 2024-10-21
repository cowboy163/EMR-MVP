'use client'
import { MessageDto } from '@/types'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';
import { EVENT_TYPES } from '@/types/eventTypes';
import { Channel } from 'pusher-js';
import { formatShortDateTime } from '@/lib/util';
import { messageSlice, useDispatch } from '@/lib/redux';

type Props = {
    initialMessages: { messages: MessageDto[], readCount: number };
    currentUserId: string;
    chatId: string;
}

export default function MessageList({ initialMessages, currentUserId, chatId }: Props) {
    const setReadCount = useRef(false);
    const channelRef = useRef<Channel | null>(null);
    const [messages, setMessages] = useState(initialMessages.messages);
    const dispatch = useDispatch();

    // update unreadCount
    useEffect(() => {
        if (!setReadCount.current) {
            dispatch(messageSlice.actions.updateUnreadCount(-initialMessages.readCount));
            setReadCount.current = true;
        }
    }, [dispatch, initialMessages.readCount]);

    // get the new message to state
    const handleNewMessage = useCallback((message: MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    // loop message, put read info after the date displayed
    const handleReadMessage = useCallback((messageIds: string[]) => {
        setMessages(prevState => prevState.map(
            message => messageIds.includes(message.id) ? { ...message, dateRead: formatShortDateTime(new Date()) } : message
        ))
    }, [])

    useEffect(() => {
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId);

            // new message channel
            channelRef.current.bind(EVENT_TYPES.NEW_MESSAGE, handleNewMessage);

            // read message channel
            channelRef.current.bind(EVENT_TYPES.READ_MESSAGE, handleReadMessage);
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind(EVENT_TYPES.NEW_MESSAGE, handleNewMessage);
                channelRef.current.unbind(EVENT_TYPES.READ_MESSAGE, handleReadMessage);
            }
        }
    }, [chatId, handleNewMessage, handleReadMessage])

    return (
        <div>
            {messages.length === 0 ? 'No messages to display' : (
                <div>
                    {messages.map(message => (
                        <MessageBox
                            key={message.id}
                            message={message}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}