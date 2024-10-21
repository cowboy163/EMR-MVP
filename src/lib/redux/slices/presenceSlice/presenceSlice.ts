import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PresenceState {
    members: string[];
}

const initialState: PresenceState = {
    members: [],
};

export const presenceSlice = createSlice({
    name: 'presence',
    initialState,
    reducers: {
        addMember: (state, action: PayloadAction<string>) => {
            state.members.push(action.payload);
        },
        removeMember: (state, action: PayloadAction<string>) => {
            state.members = state.members.filter(member => member !== action.payload);
        },
        setMembers: (state, action: PayloadAction<string[]>) => {
            state.members = action.payload
        }
    }
})
