import { useParams } from "react-router-dom";
import Chat from "../chat/Chat";
import "./chatSection.scss";

function ChatSection({ chatId: propChatId }) {
  const params = useParams();
  const chatId = propChatId || params.id;

  return (
    <div className="chat-container">
      <div className="chat-wrapper">
        <Chat chatId={chatId} />
      </div>
    </div>
  );
}

export default ChatSection;
