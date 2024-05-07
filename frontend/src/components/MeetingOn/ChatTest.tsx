import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { joinRoom } from "@/services/createRoom";
import userStore from "@/store/userStore";

interface ChatTestProps {
  roomId: number;
}

const ChatTest = ({ roomId }: ChatTestProps) => {
  const stompClientRef = useRef<Client | null>(null); // useRef를 사용하여 stompClient를 참조합니다.
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderInfo, setSenderInfo] = useState({ sender: "", profile: "", senderId: "" });
  const [connected, setConnected] = useState(false); // 연결 상태를 추적하는 상태 변수 추가
  const { id, setId, setName, setProfile } = userStore();

  useEffect(() => {
    if (!roomId) {
      console.error("No roomId available");
      return;
    }
  }, []);

  useEffect(() => {
    const joinMeetingRoom = async () => {
      try {
        const { sender, content, profile, sent_time, senderId } = await joinRoom(roomId);
        setSenderInfo({ sender, profile, senderId }); // 발신자 정보를 상태에 저장
        setId(senderId);
        setName(sender);
        setProfile(profile);

        console.log(content, sent_time);
      } catch (err) {
        console.log(err);
      }
    };

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8000/ws"),

      debug: function (str) {
        console.log(str, "버그라고?");
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      console.log("Connected: " + frame);
      setConnected(true);

      client.subscribe(`/sub/chat/${roomId}`, function (message) {
        console.log("Message received:", message.body);
        const contentType = message.headers["content-type"];
        let newMessage;
        if (contentType === "application/json") {
          newMessage = JSON.parse(message.body);
          newMessage.contentType = contentType;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { content: message.body }]);
        }
      });

      client.subscribe(`/sub/room/update/${roomId}`, function (res) {
        console.log(res.body);
      });
    };

    client.onStompError = function (frame) {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    stompClientRef.current = client;
    joinMeetingRoom();

    return () => {
      if (client && connected) {
        client.deactivate();
        console.log("Disconnected");
        setConnected(false);
      }
    };
  }, [roomId]); // roomId가 변경될 때마다 useEffect를 다시 실행합니다.

  const sendMessage = () => {
    if (message && stompClientRef.current) {
      const messageToSend = JSON.stringify({
        content: message,
        sender: senderInfo.sender, // 메시지와 함께 발신자 정보도 전송
        profile: senderInfo.profile,
        senderId: senderInfo.senderId,
      });
      console.log(messageToSend);

      stompClientRef.current.publish({
        destination: `/pub/${roomId}/sendMessage`,
        body: messageToSend,
        // skipContentLengthHeader: false,
      });

      setMessage(""); // 메시지 전송 후 입력 필드 초기화
    }
  };

  return (
    <>
      <div>
        <div className="w-96 h-96 bg-black text-white overflow-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${msg.senderId === id ? "justify-end" : "justify-start"} flex`}
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
                  className="inline-block max-w-xs px-4 py-2 rounded-lg text-center"
                  style={{ background: "#333" }}
                >
                  <div>{msg.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <input
          className="text-black"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="text-black" onClick={sendMessage}>
          Send Message
        </button>
      </div>
    </>
  );
};

export default ChatTest;
