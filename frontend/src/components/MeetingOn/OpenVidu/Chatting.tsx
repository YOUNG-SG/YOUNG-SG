import { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { joinRoom } from "@/services/Room";
import userStore from "@/store/userStore";
import createRoomStore from "@/store/createRoomStore";
import UserList from "./Chatting/UserList";
import ChatRoom from "./Chatting/ChatRoom";
import ChatSummary from "./Chatting/ChatSummary";
import { useSpeechRecognition } from "react-speech-recognition";

import chat from "../../../assets/chattingIcons/messenger.png";
import people from "../../../assets/chattingIcons/people.png";
import { tokenStore } from "@/store/tokenStore";

interface Command {
  command: string;
  callback: () => void;
}

interface ChattingProps {
  roomId: number;
  roomStatus: string | null;
  listenContinuously: () => void;
  listenStop: () => void;
  setIsRecording: (isRecording: boolean) => void;
  owner: string | null;
}

interface Message {
  content: string;
  sender?: string;
  profile?: string;
  senderId?: number;
  sent_time?: string;
  contentType?: string;
}

interface SummaryMessage {
  content: string;
  sender?: string;
  profile?: string;
  senderId?: number;
  sent_time?: string;
  contentType?: string;
}

interface Member {
  id: number;
  nickname: string;
  profile: string;
}

const Chatting = ({
  roomId,
  roomStatus,
  listenContinuously,
  listenStop,
  setIsRecording,
  owner,
}: ChattingProps) => {
  // isChat이면 채팅창, false이면 사용자 목록
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isChatStatus, setIsChatStatus] = useState<boolean>(false);
  const stompClientRef = useRef<Client | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [summaryMessages, setSummaryMessages] = useState<SummaryMessage[]>([]);
  const [senderInfo, setSenderInfo] = useState({ sender: "", profile: "", senderId: "" });
  const [connected, setConnected] = useState(false); // 연결 상태를 추적하는 상태 변수 추가
  const { id, setId, setName, setProfile } = userStore();
  const [userList, setUserList] = useState<Member[]>([]);
  const [prevStatus, setPrevStatus] = useState<string>("0");

  const { setRoomStatus, setOwner } = createRoomStore();
  const { token } = tokenStore();

  const commands: Command[] = [
    {
      command: "reset",
      callback: () => resetTranscript(),
    },
    {
      command: "shut up",
      callback: () => setMessage("I wasn't talking."),
    },
    {
      command: "Hello",
      callback: () => setMessage("Hi there!"),
    },
  ];
  const { transcript, interimTranscript, finalTranscript, resetTranscript } = useSpeechRecognition({
    commands,
  });

  useEffect(() => {
    if (!roomId) {
      console.error("No roomId available");
      return;
    }
  }, []);

  // 음성인식
  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Got final result:", transcript);
      sendSummaryMessage();
    }
  }, [interimTranscript, finalTranscript]);

  useEffect(() => {
    if (!stompClientRef.current) {
      console.log("WebSocket client not available");
      return;
    }

    if (roomStatus === "1" && prevStatus === "0") {
      setSummaryMessages((prevMessages) => [
        ...prevMessages,
        { content: "미팅이 시작되었습니다." },
      ]);
      listenContinuously();
      setIsRecording(true);
      // setRoomStatus("1"); // 상태 업데이트가 필요하다면 여기에서 처리

      stompClientRef.current.subscribe(`/sub/meetingChat/${roomId}`, (message) => {
        console.log("Meeting Chat Message received:", message.body);
        const contentType = message.headers["content-type"];
        let newMessage: SummaryMessage;
        if (contentType === "application/json") {
          newMessage = JSON.parse(message.body);
          newMessage.contentType = contentType;
          setSummaryMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          setSummaryMessages((prevMessages) => [...prevMessages, { content: message.body }]);
          // 메시지 내용이 미팅 시작이면 record on
          if (message.body === "미팅이 종료되었슴다") {
            listenStop(); // 음성 인식을 중지합니다.
            setIsRecording(false);
            setRoomStatus("2"); // 방의 상태를 '2'(종료)로 설정합니다.
          }
        }
      });

      stompClientRef.current.subscribe(`/sub/vote/${roomId}`, function (res) {
        const data = JSON.parse(res.body);
        console.log(data);
      });

      setPrevStatus(roomStatus);
    } else if (roomStatus === "2") {
      console.log("Unsubscribing from meeting chat for roomId:", roomId);
      // roomStatus가 2일 때 채팅 구독 해제
      stompClientRef.current.unsubscribe(`/sub/meetingChat/${roomId}`);
    }
  }, [roomStatus]);

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

        console.log(content, sent_time, "content, sent_time");
      } catch (err) {
        console.log(err);
      }
    };

    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_BASE_URL}` + "/ws"),
      // webSocketFactory: () => new SockJS("ws://localhost:8000"),
      // brokerURL: "ws://localhost:8000/api/ws",
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
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

      // 채팅 메시지 구독
      client.subscribe(`/sub/chat/${roomId}`, function (message) {
        console.log("Message received:", message.body);
        const contentType = message.headers["content-type"];
        let newMessage: Message;
        if (contentType === "application/json") {
          newMessage = JSON.parse(message.body);
          newMessage.contentType = contentType;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { content: message.body }]);
        }
      });

      // 상태 갱신 소켓 구독
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
      });

      setMessage(""); // 메시지 전송 후 입력 필드 초기화
    }
  };

  const sendSummaryMessage = () => {
    if (transcript && stompClientRef.current) {
      const messageToSend = JSON.stringify({
        content: transcript,
        sender: senderInfo.sender,
        profile: senderInfo.profile,
        senderId: senderInfo.senderId,
      });
      console.log(messageToSend);

      stompClientRef.current.publish({
        destination: `/pub/${roomId}/sendMeetingChat`,
        body: messageToSend,
      });

      resetTranscript();
    }
  };

  return (
    <>
      <div className="h-screen grid grid-rows-12 pt-4">
        {/* 채팅 */}
        {isChatting && (
          <div className="row-span-10 flex flex-col border rounded-xl gap-0.5 bg-black bg-opacity-70">
            <div className="flex w-full p-1 gap-0.5 h-10">
              <button
                className={`w-full ${isChatStatus ? "border-b-2 " : "text-gray-500 hover:text-gray-300"}`}
                onClick={handleIsChatClick}
              >
                <span>채팅</span>
              </button>
              <button
                className={`hover:text-white  w-full ${isChatStatus ? "text-gray-500 hover:text-gray-300" : "border-b-2 "}`}
                onClick={handleIsSummaryClick}
              >
                <span>요약</span>
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
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">
                  <ChatSummary summaryMessages={summaryMessages} />
                </div>
              </>
            )}
          </div>
        )}
        {/* 참가자 목록 */}
        {!isChatting && (
          <>
            <div className="row-span-10 w-full flex flex-col border rounded-xl bg-black bg-opacity-70">
              <UserList userList={userList} roomId={roomId} owner={owner} />
            </div>
          </>
        )}
        {/* 버튼들 */}
        <div className="row-span-2 flex gap-2 justify-end items-center">
          <button
            onClick={handleIsSubscribers}
            className="w-10 h-10 rounded-full bg-gray-400 hover:bg-gray-300 flex justify-center items-center"
          >
            <img className="w-6 h-6" src={people} alt="" />
          </button>
          <button
            onClick={handleIsChatting}
            className="w-10 h-10 rounded-full bg-gray-400 hover:bg-gray-300 flex justify-center items-center"
          >
            <img className="w-6 h-6" src={chat} alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatting;
