import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import messageReducer from "./messageSlice";
import eventReducer from "./eventSlice";

const reducer = {
    auth: authReducer,
    message: messageReducer,
    event: eventReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;