import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from './messageSlice';

import EventService from '../services/eventService';
import MessageService from '../services/messageService'
import { IEvent } from '../Interfaces/IEvent';
import { IUser } from '../Interfaces/IUser';
import jwtDecoder from "../helpers/jwtDecoder";

const eventId = localStorage.getItem("eventId");
const emptyEvent: IEvent = {
    id: '',
    title: '',
    description:'',
    host:'',
    attendees: [],
    messages: [],
    voted:[],
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

export const fetchMessages = createAsyncThunk(
    "event/fetchMessages",
    async (title: string, thunkAPI) => {
        try {
            const response = await MessageService.fetchMessages(title);
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

const initialState = {
    eventId,
    event,
    loggedInChat: !!eventId,
    voted: false,
    loading: false,
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
        },
        setUserVPoints : (state, action) => {
            const user = action.payload;
            const userIndex = state.event.attendees.findIndex((attendee: IUser) => attendee.id === user.id);
            state.event.attendees[userIndex] = user;
        },
        clearEventData: (state) => {
            state.event = emptyEvent;
            state.eventId = '';
            state.loggedInChat = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinEvent.fulfilled, (state, action) => {
                state.loggedInChat = true;
                state.eventId = action.payload.event.id;
                state.loading = false;
            })
            .addCase(joinEvent.pending, (state, action) => {
                state.loggedInChat = false;
                state.loading = true;
            })
            .addCase(joinEvent.rejected, (state, action) => {
                state.loggedInChat = false;
                state.loading = false;
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.event = action.payload.event;
                state.loading = false;
            })
            .addCase(fetchEvent.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.event.messages = action.payload.messages;
                state.loading = false;
            })
            .addCase(fetchMessages.pending, (state, action) => {
                state.loading = true;
            })
    }
});

const { reducer, actions } = eventSlice;
export const { setEventId, setVoted, setUserVPoints, clearEventData } = actions;
export default reducer;