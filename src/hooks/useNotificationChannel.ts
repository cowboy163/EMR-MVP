'use client'
import { newLikeToast, newMessageToast } from "@/components/NotificationToast";
import { pusherClient } from "@/lib/pusher";
import { messageSlice, useDispatch } from "@/lib/redux";
import { getBaseLinkBasedOnRolePlatform, getMemberLinkBasedOnRolePlatform } from "@/lib/util";
import { MessageDto } from "@/types";
import { RoleType } from "@/types/constantsType";
import { EVENT_ID_TYPES, EVENT_TYPES } from "@/types/eventTypes";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js"
import { useCallback, useEffect, useRef } from "react"
import { toast } from "react-toastify";

export const useNotificationChannel = (userId: string | null, role: RoleType | null) => {
    const channelRef = useRef<Channel | null>(null);
    const dispatch = useDispatch();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleNewMessage = useCallback((message: MessageDto) => {
        // message will add to notification if user is in message page and not in outbox tab
        // notification will not show if user is in chat page 
        if (!role) {
            toast.info(`Not Authorized`)
        } else if (pathname === `${getBaseLinkBasedOnRolePlatform(role)}/messages`
            && searchParams.get('container') !== 'outbox'
        ) {
            dispatch(messageSlice.actions.addMessage(message));
            dispatch(messageSlice.actions.updateUnreadCount(1));
        } else if (pathname !== `${getMemberLinkBasedOnRolePlatform(role)}/${message.senderId}/chat`) {
            newMessageToast(message, role);
            dispatch(messageSlice.actions.updateUnreadCount(1));
        }
    }, [dispatch, pathname, searchParams, role])

    const handleNewLike = useCallback((data: { name: string, image: string | null, userId: string, role: RoleType }) => {
        if (role) {
            newLikeToast(data.name, data.image, data.userId, role);
        }
    }, [role]);

    useEffect(() => {
        if (!userId) return;
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(`${EVENT_ID_TYPES.PRIVATE}-${userId}`);
            channelRef.current.bind(EVENT_TYPES.NEW_MESSAGE, handleNewMessage);
            channelRef.current.bind(EVENT_TYPES.NEW_LIKE, handleNewLike);
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind(EVENT_TYPES.NEW_MESSAGE, handleNewMessage);
                channelRef.current.unbind(EVENT_TYPES.NEW_LIKE, handleNewLike);
                channelRef.current = null;
            }
        }
    }, [userId, handleNewMessage, handleNewLike])
}