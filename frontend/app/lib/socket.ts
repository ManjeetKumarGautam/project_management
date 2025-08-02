import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api-v1";

export const socket = io(BASE_URL, {
    autoConnect: false,
});