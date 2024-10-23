'use client'
import { updateLastActive } from "@/app/actions/memberActions";
import { pusherClient } from "@/lib/pusher";
import { presenceSlice, useDispatch } from "@/lib/redux"
import { EVENT_ID_TYPES, EVENT_TYPES } from "@/types/eventTypes";
import { Channel, Members } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";

export const usePresenceChannel = (userId: string | null, profileComplete: boolean) => {
    const dispatch = useDispatch();

    const channelRef = useRef<Channel | null>(null);

    const handleSetMembers = useCallback((memberIds: string[]) => {
        dispatch(presenceSlice.actions.setMembers(memberIds));
    }, [dispatch])

    const handleAddMember = useCallback((memberId: string) => {
        dispatch(presenceSlice.actions.addMember(memberId))
    }, [dispatch])

    const handleRemoveMember = useCallback((memberId: string) => {
        dispatch(presenceSlice.actions.removeMember(memberId));
    }, [dispatch])

    useEffect(() => {
        if (!userId || !profileComplete) return;
        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe(EVENT_ID_TYPES.PRESENCE);

            channelRef.current.bind(EVENT_TYPES.SUBSCRIPTION_SUCCESS, async (members: Members) => {
                handleSetMembers(Object.keys(members.members));
                await updateLastActive();
            });

            channelRef.current.bind(EVENT_TYPES.MEMBER_ADD, (member: Record<string, any>) => {
                handleAddMember(member.id)
            });

            channelRef.current.bind(EVENT_TYPES.MEMBER_REMOVE, (member: Record<string, any>) => {
                handleRemoveMember(member.id)
            });
        }

        return () => {
            if (channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind(EVENT_TYPES.SUBSCRIPTION_SUCCESS, handleSetMembers);
                channelRef.current.unbind(EVENT_TYPES.MEMBER_ADD, handleAddMember);
                channelRef.current.unbind(EVENT_TYPES.MEMBER_REMOVE, handleRemoveMember);
            }
        }
    }, [handleSetMembers, handleAddMember, handleRemoveMember, userId, profileComplete])
}