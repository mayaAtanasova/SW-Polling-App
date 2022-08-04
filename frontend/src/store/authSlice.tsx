import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./messageSlice";
import { clearEventData, setEventId } from "./eventSlice";

import AuthService from "../services/authService";
import { IUser, IUserCompact } from "../Interfaces/IUser";
import jwtDecoder from "../helpers/jwtDecoder";
import { TokenResponse } from "@react-oauth/google";

const emptyUser: IUserCompact = {
    id: '',
    email: '',
    displayName: '',
    vpoints: 0,
}

export const register = createAsyncThunk(
    "auth/register",
    async (user: IUser, thunkAPI) => {
        try {
            const response = await AuthService.register(user);
            if (response) {
                thunkAPI.dispatch(setMessage(response.message));
                return response;
            }
            return response;
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (user: { email: string, password: string }, thunkAPI) => {
        try {
            const response = await AuthService.login(user);
            thunkAPI.dispatch(setMessage(response.message));
            return response;
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const googleLogin = createAsyncThunk(
    "auth/googleLogin",
    async (tokenResponse: TokenResponse, thunkAPI) => {
        try {
            const response = await AuthService.googleLogin(tokenResponse);
            thunkAPI.dispatch(setMessage(response.message));
            return response;
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        await AuthService.logout();
        thunkAPI.dispatch(clearEventData());
        thunkAPI.dispatch(setMessage("User logged out"));
    }
)

const initialState = {
    user: emptyUser,
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isAdmin = action.payload && action.payload.role === 'admin';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isAdmin = action.payload.user.role === "admin";
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(login.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isAdmin = action.payload.user.role === "admin";
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(googleLogin.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(googleLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.isAdmin = action.payload.user.role === "admin";
            })
            .addCase(googleLogin.rejected, (state, action) => {
                state.loading = false;
            })
            .addCase(logout.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.isAdmin = false;
                state.user = emptyUser;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
            })
    }
});

const { reducer, actions } = authSlice;
export const { setUser } = actions;
export default reducer;