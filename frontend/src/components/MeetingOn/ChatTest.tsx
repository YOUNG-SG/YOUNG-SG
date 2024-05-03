import { useEffect, useRef, useState } from "react";
// import createRoomStore from "@/store/createRoom";
import { tokenStore } from "@/store/tokenStore";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { joinRoom } from "@/services/createRoom";

interface ChatTestProps {
  roomId: string;
}

const ChatTest = ({ roomId }: ChatTestProps) => {
  // const { roomId } = createRoomStore();
  const { token } = tokenStore();
  const stompClientRef = useRef(null); // useRef를 사용하여 stompClient를 참조합니다.
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

    const socket = new SockJS("http://localhost:8000/ws");
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient; // stompClient 인스턴스를 ref에 할당합니다.

    stompClient.connect(
      {},
      function (frame) {
        console.log("Connected: " + frame);
        setConnected(true); // 연결 상태를 true로 설정

        stompClient.subscribe(`/sub/chat/${roomId}`, function (response) {
          const newMessage = JSON.parse(response.body);
          console.log("Received:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]); // 수신된 메시지를 messages 배열에 추가
        });
      },
      function (err) {
        console.error("connection error:", err);
        setConnected(false); // 연결 오류 발생 시 연결 상태를 false로 설정
      },
    );
    joinMeetingRoom();

    return () => {
      if (stompClientRef.current && connected) {
        stompClientRef.current.disconnect();
        console.log("Disconnected");
        setConnected(false); // 연결 오류 발생 시 연결 상태를 false로 설정
      }
    };
  }, [roomId]); // roomId가 변경될 때마다 useEffect를 다시 실행합니다.

  const sendMessage = () => {
    console.log(senderInfo);
    console.log(stompClientRef);
    if (message && stompClientRef.current) {
      const messageToSend = JSON.stringify({
        content: message,
        sender: senderInfo.sender, // 메시지와 함께 발신자 정보도 전송
        profile: senderInfo.profile,
        senderId: senderInfo.senderId,
      });
      stompClientRef.current.send(`/pub/chat/${roomId}/SendMessage`, {}, messageToSend);
      setMessage(""); // 메시지 전송 후 입력 필드 초기화

      const newMessage = {
        content: message,
        sender: senderInfo.sender,
        profile: senderInfo.profile,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

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
