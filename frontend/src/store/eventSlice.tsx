import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from './messageSlice';

import EventService from '../services/eventService';
import MessageService from '../services/messageService'
import { IEvent } from '../Interfaces/IEvent';
import { IUser } from '../Interfaces/IUser';
import jwtDecoder from "../hooks/jwtDecoder";

const eventId = localStorage.getItem("eventId");
const emptyEvent: IEvent = {
    id: '',
    title: '',
    attendees: [],
    messages: [],
}
const event: IEvent = emptyEvent;


export const joinEvent = createAsyncThunk(
    "event/joinEvent",
    async (joinEventCredentials: { title: string, userId: string }, thunkAPI) => {
        try {
            const response = await EventService.joinEvent(joinEventCredentials);
            thunkAPI.dispatch(setMessage(response.message));
            const joinResponse = await EventService.fetchEventData(response.evid);
            return joinResponse;
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    });

export const fetchEvent = createAsyncThunk(
    "event/fetchEvent",
    async (eventId: string, thunkAPI) => {
        try {
            const response = await EventService.fetchEventData(eventId);
            thunkAPI.dispatch(setMessage(response.message))
            return response;
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message)
                || error.message
                || error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    });

export const leaveEvent = createAsyncThunk(
    "event/leaveEvent",
    async (leaveEventCredentials: { eventId: string, userId: string }, thunkAPI) => {
        try {
            const response = await EventService.leaveEvent(leaveEventCredentials);
            thunkAPI.dispatch(setMessage(response.message));
            return;
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

export const fetchMessages = createAsyncThunk(
    "event/fetchMessages",
    async (eventId: string, thunkAPI) => {
        try {
            const response = await MessageService.fetchMessages(eventId);
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

const initialState = {
    eventId,
    event,
    loggedInChat: !!eventId,
    voted: false,
}

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        setEventId: (state, action) => {
            state.eventId = action.payload;
        },
        setVoted: (state, action) => {
            state.voted = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinEvent.fulfilled, (state, action) => {
                state.loggedInChat = true;
                state.eventId = action.payload.event.id;
                state.event = action.payload.event;
            })
            .addCase(joinEvent.pending, (state, action) => {
                state.loggedInChat = false;
            })
            .addCase(joinEvent.rejected, (state, action) => {
                state.loggedInChat = false;
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.event = action.payload.event;
            })
            .addCase(leaveEvent.fulfilled, (state, action) => {
                state.event = emptyEvent;
                state.eventId = '';
                state.loggedInChat = false;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.event.messages = action.payload.messages;
            })
    }
});

const { reducer, actions } = eventSlice;
export const { setEventId, setVoted } = actions;
export default reducer;