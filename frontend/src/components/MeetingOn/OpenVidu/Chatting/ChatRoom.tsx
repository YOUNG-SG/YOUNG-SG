import { useEffect, useRef } from "react";
import send from "../../../../assets/chattingIcons/send.png";

interface Message {
  content: string;
  senderId?: number;
  contentType?: string;
  profile?: string;
  sent_time?: string;
}

interface ChattingProps {
  id: number | null;
  messages: Message[];
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

const ChatRoom = ({ id, messages, message, setMessage, sendMessage }: ChattingProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex-1 m-1 overflow-y-auto rounded-xl">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 ${msg.senderId === id ? "justify-end" : "justify-start"} flex`}
            ref={messagesEndRef}
          >
            {msg.contentType === "application/json" ? (
              <>
                <div className="items-center flex">
                  {msg.senderId !== id && (
                    <img className="rounded-full w-10 h-10 mr-2" src={msg.profile} alt="" />
                  )}
                </div>
                <div
                  className="inline-block max-w-xs px-4 py-2 rounded-lg"
                  style={{ background: msg.senderId === id ? "#005c99" : "#333" }}
                >
                  <div>{msg.content}</div>
                  <div className="text-sm text-gray-300">{msg.sent_time}</div>
                </div>
              </>
            ) : (
              <div
                className="inline-block max-w-xs px-3 py-2 rounded-lg text-center"
                style={{ background: "#333" }}
              >
                <div>{msg.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 p-2 border-t border-gray-200 items-end ">
        <input
          className="border rounded-xl h-7 px-2 w-full text-black"
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="w-9 h-7 rounded-2xl bg-blue-400 hover:bg-blue-600 flex justify-center items-center"
          onClick={sendMessage}
        >
          <img className="w-5 h-5" src={send} alt="" />
        </button>
      </div>
    </>
  );
};

export default ChatRoom;
