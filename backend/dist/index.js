"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
let allSocket = [];
const wss = new ws_1.WebSocketServer({ port: 8080 }, () => {
    console.log("✅ WebSocket server started on port 8080");
});
const sendEmailNotification = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    if (roomId === "420") {
        console.log("📩 Sending email notification...");
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: "coderabhay1@gmail.com", // ⚠️ Replace with your actual email
                pass: "sdwk chwl pmiy apen", // ⚠️ Replace with your actual password or App Password
            },
        });
        const mailOptions = {
            from: "coderabhay1@gmail.com",
            to: "akgabhay11@gmail.com", // Replace with recipient email
            subject: "Your Friend Joined Room 420",
            text: "🚀 Your friend is now online and has joined Room 420!",
        };
        try {
            yield transporter.sendMail(mailOptions);
            console.log("✅ Email sent successfully!");
        }
        catch (error) {
            console.error("❌ Error sending email:", error);
        }
    }
});
wss.on("connection", (socket) => {
    console.log("🔗 New client connected");
    socket.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log("📩 Received message:", parsedMessage);
            if (parsedMessage.type === "join") {
                console.log(`👤 User joined room: ${parsedMessage.payload.roomId}`);
                allSocket.push({ socket, room: parsedMessage.payload.roomId });
                // Send email notification asynchronously
                sendEmailNotification(parsedMessage.payload.roomId);
            }
            if (parsedMessage.type === "chat") {
                let currRoom = (_a = allSocket.find((user) => user.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
                console.log("💬 Current room:", currRoom);
                if (currRoom) {
                    allSocket.forEach((user) => {
                        if (user.room === currRoom) {
                            user.socket.send(JSON.stringify({
                                type: "chat",
                                payload: { message: parsedMessage.payload.message },
                                sender: user.socket === socket ? "self" : "other",
                            }));
                        }
                    });
                }
            }
        }
        catch (error) {
            console.error("❌ Error parsing message:", error);
        }
    }));
    socket.on("close", () => {
        console.log("❌ Client disconnected");
        allSocket = allSocket.filter((user) => user.socket !== socket);
    });
});
