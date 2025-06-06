import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slices/UserSlice';
import registerReducer from "./slices/RegisterSlice";
import FriendSlice from './slices/FriendSlice';
import ConversationSlice from './slices/ConversationSlice';
import MessageSlice from './slices/MessageSlice';

export const store = configureStore({
    reducer: {
        user: UserSlice,
        register: registerReducer,
        friend: FriendSlice,
        conversation: ConversationSlice,
        message: MessageSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }), 
});
