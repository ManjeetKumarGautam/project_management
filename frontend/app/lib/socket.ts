import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL;

export const socket = io(BASE_URL, {
    autoConnect: false,
});