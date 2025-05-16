import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { MessageCircleCode } from "lucide-react";
import axios from "axios";

import Messages from "./Messages";
import { setMessages } from "../../redux/chatSlice";
import { setSelectedUser } from "../../redux/authSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);

  const [textMessage, setTextMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset selected user on unmount
  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, []);

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return;

    try {
      setIsSending(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-gray-50 p-4 rounded-lg shadow-md relative">
      {selectedUser ? (
        <section className="flex flex-col h-[70vh]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 bg-white sticky top-0 z-10">
            <Avatar
              alt={selectedUser.username}
              src={selectedUser.profilePicture}
              sx={{ width: 40, height: 40 }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">
                {selectedUser.username}
              </span>
              <span className="text-sm text-gray-500">Chatting now</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
            <Messages selectedUser={selectedUser} />
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2 p-3 border-t border-gray-300 bg-white">
            <input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessageHandler(selectedUser?._id)
              }
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!textMessage.trim() || isSending}
              onClick={() => sendMessageHandler(selectedUser?._id)}
              sx={{ minWidth: "80px" }}
            >
              {isSending ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </section>
      ) : (
        // No user selected UI
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
          <MessageCircleCode className="w-24 h-24 mb-4 text-blue-500" />
          <h1 className="text-xl font-bold">Your Messages</h1>
          <p className="text-sm">Send a message to start a chat</p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
