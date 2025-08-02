import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

import routes from "./routes/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});

//  Socket logic
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId); // user joins their own room
        // console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
        // console.log("Socket disconnected:", socket.id);
    });
});

//  DB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected successfully."))
    .catch((err) => console.log("Failed to connect to DB:", err));

// ✅ Routes and Error Handlers
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to UKPMS API" });
});
app.use("/api-v1", routes);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({ message: "Internal server error" });
});
app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ✅ Export `io` so controllers can emit events
export { io };
