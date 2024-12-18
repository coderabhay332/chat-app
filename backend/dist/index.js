"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
let allSocket = [];
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (socket, req) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            console.log("User joined room: " + parsedMessage.payload.roomId);
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type === "chat") {
            let currRoom = null;
            // Find the current user's room
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket === socket) {
                    currRoom = allSocket[i].room;
                    console.log("Current room: " + allSocket[i].room);
                    break;
                }
            }
            if (currRoom) {
                // Send the message to all sockets in the same room
                for (let i = 0; i < allSocket.length; i++) {
                    if (allSocket[i].room === currRoom) {
                        allSocket[i].socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: parsedMessage.payload.message,
                            },
                            sender: allSocket[i].socket === socket ? "self" : "other",
                        }));
                    }
                }
            }
        }
    });
    socket.on("close", () => {
        // Remove the disconnected socket from the list
        allSocket = allSocket.filter((user) => user.socket !== socket);
    });
});
