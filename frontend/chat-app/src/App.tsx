import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import { Styles } from "./types";

function App() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [joined, setJoined] = useState(false);

  interface Payload {
    message: string;
  }

  interface ChatMessage {
    type: "chat" | "join";
    payload: Payload;
    sender?: string;
  }

  useEffect(() => {
    const socket = new WebSocket(BACKEND_URL);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setChat((prev) => [...prev, incomingMessage]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId.trim() === "") return;

    const joinMessage = JSON.stringify({
      type: "join",
      payload: {
        roomId: roomId,
      },
    });
    //@ts-ignore
    ws.send(joinMessage);
    setJoined(true);
    console.log(`Joined room: ${roomId}`);
  };

  const handleSendMessage = () => {
    if (message.trim() === "" || !joined) return;

    const chatMessage = {
      type: "chat",
      payload: {
        message: message,
      },
    };
    //@ts-ignore
    ws.send(JSON.stringify(chatMessage));
    setMessage("");
  };

  const handleClearMessages = () => {
    setChat([]); // Clears all messages
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>WebSocket Chat App</h1>

      {!joined ? (
        <div style={styles.joinContainer}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleJoinRoom} style={styles.button}>
            Join Room
          </button>
        </div>
      ) : (
        <div style={styles.chatContainer}>
          <div style={styles.chatBox}>
            {chat.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.chatMessage,
                  alignSelf: msg.sender === "self" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "self" ? "#007BFF" : "#e0e0e0",
                  color: msg.sender === "self" ? "#fff" : "#000",
                }}
              >
                {msg.payload.message}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSendMessage} style={styles.button}>
              Send
            </button>
          </div>
          <button onClick={handleClearMessages} style={styles.clearButton}>
            Clear Messages
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    padding: "10px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  joinContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  chatBox: {
    width: "80%",
    height: "400px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflowY: "scroll",
    padding: "10px",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  chatMessage: {
    marginBottom: "10px",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "60%",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  input: {
    flex: 1,
    padding: "10px",
    marginRight: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  clearButton: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
