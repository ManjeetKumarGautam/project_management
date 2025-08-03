import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// ✅ Correct CORS Setup
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.options("*", cors());

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "*"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });
});


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch((err) => console.error("❌ DB Connection Failed:", err));


app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to UKPMS API" });
});

app.use("/api-v1", routes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


export { io };
