import { MessageDto } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MessageState {
    messages: MessageDto[];
    unreadCount: number;
}

const initialState: MessageState = {
    messages: [],
    unreadCount: 0
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageDto>) => {
            state.messages.unshift(action.payload);
        },
        removeMessage: (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter(message => message.id !== action.payload);
        },
        setMessages: (state, action: PayloadAction<MessageDto[]>) => {
            const messages = action.payload;
            const map = new Map([...state.messages, ...messages].map(m => [m.id, m]));
            const uniqueMessages = Array.from(map.values());
            state.messages = uniqueMessages;
        },
        updateUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount += action.payload;
        },
        resetMessages: (state) => {
            state.messages = [];
        }
    }
})