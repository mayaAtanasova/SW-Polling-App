import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import messageReducer from "./messageSlice";

const reducer = {
    auth: authReducer,
    message: messageReducer,
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;