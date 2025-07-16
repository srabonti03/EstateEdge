import { useEffect, useRef, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./chat.scss";
import { IoIosArrowForward } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext";

function Chat({ chatId }) {
  const [chats, setChats] = useState([]);
  const [unreadChatIds, setUnreadChatIds] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat/", {
          credentials: "include",
        });
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    if (currentUser?.id) fetchChats();
  }, [currentUser?.id]);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/chat/unread", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        const ids = data.map((chat) => chat.id);
        setUnreadChatIds(ids);
      } catch (err) {
        console.error("Failed to fetch unread chats:", err);
      }
    };

    if (currentUser?.id) fetchUnreadChats();
  }, [currentUser?.id]);

  useEffect(() => {
    if (chatId && chats.length > 0 && !selectedChat) {
      openChat(chatId);
    }
  }, [chatId, chats, selectedChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  const openChat = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/chat/read/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      const res = await fetch(`http://localhost:3000/api/chat/${id}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch chat data");
      const data = await res.json();

      const chatData = {
        id: data.chat.id,
        participants: data.chat.participants || [],
        messages: data.messages || [],
        lastMessage: data.chat.lastMessage,
        seenBy: data.chat.seenBy || [],
      };

      setSelectedChat(chatData);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === id
            ? {
                ...chat,
                seenBy: [...(chat.seenBy || []), currentUser?.id],
              }
            : chat
        )
      );

      setUnreadChatIds((prev) => prev.filter((cid) => cid !== id));
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/message/${selectedChat.id}/messages`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newMessage }),
        }
      );

      if (!res.ok) throw new Error("Failed to send message");

      const { data } = await res.json();

      const updatedMessages = [...selectedChat.messages, data];
      const updatedChat = {
        ...selectedChat,
        messages: updatedMessages,
        lastMessage: data.text,
      };

      setSelectedChat(updatedChat);

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat.id
            ? {
                ...chat,
                lastMessage: data.text,
                seenBy: [...(chat.seenBy || []), currentUser?.id],
              }
            : chat
        )
      );

      setNewMessage("");
    } catch (error) {
      console.error("Sending message failed:", error);
    }
  };

  const closeChat = () => {
    setSelectedChat(null);
    searchParams.delete("chatId");
    setSearchParams(searchParams);
  };

  return (
    <div className="chat">
      <div className={`messages ${selectedChat ? "no-scroll" : ""}`}>
        <h1>
          Messages{" "}
          <Link
            to={currentUser?.role === "agent" ? "/agentprofile" : "/profile"}
          >
            <IoIosArrowForward className="arrow" />
          </Link>
        </h1>
        {chats.map((chat) => {
          const participant = chat.participants.find(
            (p) => p.id !== currentUser?.id
          );
          const avatar = participant?.avatar
            ? `http://localhost:3000${participant.avatar}`
            : "/default-avatar.png";

          const isUnread = unreadChatIds.includes(chat.id);

          return (
            <div
              className="message"
              key={chat.id}
              onClick={() => openChat(chat.id)}
              style={{ cursor: "pointer" }}
            >
              <Link to={`/agent/${participant.id}`} className="avatar-link">
                <img src={avatar} alt={participant?.username} />
              </Link>
              <div className="messageContent">
                <Link
                  to={`/agent/${participant.id}`}
                  className="username-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>{participant?.username}</span>
                </Link>
                <p className={isUnread ? "unread" : ""}>{chat.lastMessage}</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedChat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src={
                  selectedChat.participants.find(
                    (p) => p.id !== currentUser?.id
                  )?.avatar
                    ? `http://localhost:3000${
                        selectedChat.participants.find(
                          (p) => p.id !== currentUser?.id
                        )?.avatar
                      }`
                    : "/default-avatar.png"
                }
                alt={
                  selectedChat.participants.find(
                    (p) => p.id !== currentUser?.id
                  )?.username
                }
              />
              {
                selectedChat.participants.find((p) => p.id !== currentUser?.id)
                  ?.username
              }
            </div>
            <span className="close" onClick={closeChat}>
              X
            </span>
          </div>
          <div className="center" ref={messagesEndRef}>
            {selectedChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatMessage ${
                  msg.userId === currentUser?.id ? "own" : ""
                }`}
              >
                <p>{msg.text}</p>
                <span className="time">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
          <div className="bottom">
            <textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            ></textarea>
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
