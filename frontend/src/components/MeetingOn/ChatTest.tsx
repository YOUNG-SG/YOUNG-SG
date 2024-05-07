import { useEffect, useRef, useState } from "react";
// import createRoomStore from "@/store/createRoom";
import { tokenStore } from "@/store/tokenStore";
import SockJS from "sockjs-client";
// import Stomp from "stompjs";
import { Client } from "@stomp/stompjs";
import { joinRoom } from "@/services/createRoom";
import { client } from "stompjs";

interface ChatTestProps {
  roomId: number;
}

const ChatTest = ({ roomId }: ChatTestProps) => {
  // const { roomId } = createRoomStore();
  const { token } = tokenStore();
  const stompClientRef = useRef<Client | null>(null); // useRef를 사용하여 stompClient를 참조합니다.
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderInfo, setSenderInfo] = useState({ sender: "", profile: "", senderId: "" });
  const [connected, setConnected] = useState(false); // 연결 상태를 추적하는 상태 변수 추가

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
        console.log("쪼인");
      } catch (err) {
        console.log(err);
      }
    };

    // const socket = new SockJS("http://localhost:8000/ws");
    // const client = new Client({
    //   brokerURL: socket.url,
    //   connectHeaders: {
    //     login: "user",
    //     passcode: "password",
    //   },
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8000/ws"),

      debug: function (str) {
        console.log(str, "버그라고?");
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    // const stompClient = Stomp.over(socket);
    // stompClientRef.current = stompClient; // stompClient 인스턴스를 ref에 할당합니다.
    client.onConnect = function (frame) {
      console.log("Connected: " + frame);
      setConnected(true);

      client.subscribe(
        `/sub/chat/${roomId}`,
        function (message) {
          console.log("Message received:", message);
          if (message.headers["content-type"] === "application/json") {
            try {
              // 메시지를 JSON으로 파싱하고 상태를 업데이트
              const newMessage = JSON.parse(message.body);
              console.log("Received JSON:", newMessage);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            } catch (error) {
              console.error("Error parsing JSON:", error);
              console.log(message);
            }
          } else {
            // 텍스트 메시지를 그대로 상태에 추가
            console.log("Received text:", message.body);
            setMessages((prevMessages) => [...prevMessages, { content: message.body }]);
          }
        },
        {},
      );
    };

    client.onStompError = function (frame) {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.activate();
    stompClientRef.current = client;
    joinMeetingRoom();

    // return () => {
    //   if (stompClientRef.current && connected) {
    //     stompClientRef.current.disconnect();
    //     console.log("Disconnected");
    //     setConnected(false); // 연결 오류 발생 시 연결 상태를 false로 설정
    //   }
    // };
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
        sent_time: getCurrentLocalTime(),
        senderId: senderInfo.senderId,
      });

      stompClientRef.current.publish({
        destination: `/pub/${roomId}/sendMessage`,
        body: messageToSend,
        // skipContentLengthHeader: false,
      });

      console.log(messageToSend);
      setMessage(""); // 메시지 전송 후 입력 필드 초기화

      const newMessage = JSON.parse(messageToSend);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  function getCurrentLocalTime() {
    const now = new Date();
    // 시간 정보만을 HH:mm:ss 형식으로 변환
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  return (
    <>
      <div>
        <div className="w-96 h-96 bg-black text-white overflow-auto">
          {messages.map((msg, index) => (
            <div key={index}>{msg.content}</div> // 화면에 메시지 내용을 표시
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
