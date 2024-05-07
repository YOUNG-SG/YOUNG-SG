import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { joinRoom } from "@/services/createRoom";
import userStore from "@/store/userStore";
import createRoomStore from "@/store/createRoom";
import UserList from "./Chatting/UserList";
import ChatRoom from "./Chatting/ChatRoom";

import chat from "../../../assets/chattingIcons/messenger.png";
import people from "../../../assets/chattingIcons/people.png";

interface ChattingProps {
  roomId: number;
}

const Chatting = ({ roomId }: ChattingProps) => {
  // isChat이면 채팅창, false이면 사용자 목록
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isChatStatus, setIsChatStatus] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [senderInfo, setSenderInfo] = useState({ sender: "", profile: "", senderId: "" });
  const [connected, setConnected] = useState(false); // 연결 상태를 추적하는 상태 변수 추가
  const { id, setId, setName, setProfile } = userStore();
  const { roomStatus, owner, setRoomStatus, setOwner } = createRoomStore();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (!roomId) {
      console.error("No roomId available");
      return;
    }
  }, []);

  const handleIsChatting = () => {
    const status = isChatting;
    if (status === false) {
      setIsChatting(!status);
    }
  };

  const handleIsSubscribers = () => {
    const status = isChatting;
    if (status === true) {
      setIsChatting(!status);
    }
  };

  const handleIsChatClick = () => {
    setIsChatStatus(true);
  };
  const handleIsSummaryClick = () => {
    setIsChatStatus(false);
  };

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
        const data = JSON.parse(res.body);
        console.log(data);
        setOwner(data.owner);
        setRoomStatus(data.status);
        setUserList(data.members);
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
      <div className="h-screen grid grid-rows-12 pt-4">
        {/* 채팅 */}
        {isChatting && (
          <div className="row-span-10 flex flex-col border rounded-xl gap-0.5 bg-black bg-opacity-70">
            <div className="flex w-full p-1 gap-0.5 ">
              <button
                className="border bg-gray-300 hover:bg-gray-500 hover:text-white rounded-md w-full"
                onClick={handleIsChatClick}
              >
                <span className="text-black text">채팅</span>
              </button>
              <button
                className="border bg-gray-300 hover:bg-gray-500 hover:text-white rounded-md w-full"
                onClick={handleIsSummaryClick}
              >
                <span className="text-black">요약</span>
              </button>
            </div>
            {/* 채팅창 부분 */}
            {isChatStatus && (
              <>
                <ChatRoom
                  id={id}
                  messages={messages}
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                />
              </>
            )}
            {/* 요약 부분 */}
            {!isChatStatus && (
              <>
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">ㅇㅁㅇ</div>
              </>
            )}
          </div>
        )}
        {/* 참가자 목록 */}
        {!isChatting && (
          <>
            <div className="row-span-10 w-full flex flex-col border rounded-xl bg-black bg-opacity-70">
              <UserList userList={userList} owner={owner} />
            </div>
          </>
        )}
        {/* 버튼들 */}
        <div className="row-span-2 flex gap-2 justify-end items-center">
          <button
            onClick={handleIsSubscribers}
            className="w-10 h-10 rounded-full bg-gray-400 flex justify-center items-center"
          >
            <img className="w-6 h-6" src={people} alt="" />
          </button>
          <button
            onClick={handleIsChatting}
            className="w-10 h-10 rounded-full bg-gray-400 flex justify-center items-center"
          >
            <img className="w-6 h-6" src={chat} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatting;
