import { deleteMessage, getMessagesByContainer } from "@/app/actions/messageActions";
import { messageSlice, useDispatch, useSelector } from "@/lib/redux";
import { getMemberLinkBasedOnRolePlatform } from "@/lib/util";
import { MessageDto } from "@/types";
import { RoleType } from "@/types/constantsType";
import { useRouter, useSearchParams } from "next/navigation";
import { Key, useCallback, useEffect, useRef, useState } from "react";

export const useMessages = (initialMessages: MessageDto[], rolePlatform: RoleType, nextCursor?: string) => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.message.messages);
    const cursorRef = useRef(nextCursor);
    const searchParams = useSearchParams();
    const isOutbox = searchParams.get('container') === 'outbox';
    const router = useRouter();
    const [isDeleting, setDeleting] = useState({ id: '', loading: false });
    const container = searchParams.get('container');
    const [loadingMore, setLoadingMore] = useState(false);


    useEffect(() => {
        dispatch(messageSlice.actions.setMessages(initialMessages));
        cursorRef.current = nextCursor;

        return () => {
            dispatch(messageSlice.actions.resetMessages());
        }
    }, [dispatch, initialMessages, nextCursor])
    
    // for lazy loading
    const loadMore = useCallback(async () => {
        if (cursorRef.current) {
            setLoadingMore(true);
            const { messages, nextCursor } = await getMessagesByContainer(container, cursorRef.current);
            dispatch(messageSlice.actions.setMessages(messages));
            cursorRef.current = nextCursor;
            setLoadingMore(false)
        }
    }, [container, dispatch])

    const columns = [
        { key: isOutbox ? 'recipientName' : 'senderName', label: isOutbox ? 'Recipient' : 'Sender' },
        { key: 'text', label: 'Message' },
        { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
        { key: 'actions', label: 'Actions' },
    ]

    const handleDeleteMessage = useCallback(async (message: MessageDto) => {
        setDeleting({ id: message.id, loading: true });
        await deleteMessage(message.id, isOutbox);
        dispatch(messageSlice.actions.removeMessage(message.id));
        if (!message.dateRead && !isOutbox) {
            dispatch(messageSlice.actions.updateUnreadCount(-1));
        }
        setDeleting({ id: '', loading: false })
    }, [isOutbox, dispatch])

    const handleRowSelect = (key: Key) => {
        const message = messages.find(m => m.id === key);
        const url = isOutbox ? `${getMemberLinkBasedOnRolePlatform(rolePlatform)}/${message?.recipientId}` : `${getMemberLinkBasedOnRolePlatform(rolePlatform)}/${message?.senderId}`;
        router.push(url + '/chat')
    }

    return {
        isOutbox,
        columns,
        deletMessage: handleDeleteMessage,
        selectRow: handleRowSelect,
        isDeleting,
        messages,
        loadMore,
        loadingMore,
        hasMore: !!cursorRef.current
    }
}