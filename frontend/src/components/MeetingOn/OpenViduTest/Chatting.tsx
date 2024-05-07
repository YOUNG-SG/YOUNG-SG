import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import send from "../../../assets/chattingIcons/send.png";
import chat from "../../../assets/chattingIcons/messenger.png";
import people from "../../../assets/chattingIcons/people.png";
import createRoomStore from "@/store/createRoom";

const Chatting = () => {
  const { roomId } = createRoomStore();

  // isChat이면 채팅창, false이면 사용자 목록
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isChatStatus, setIsChatStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

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

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log("메시지를 보냅니더", message);
    setMessage("");
  };

  // socket

  return (
    <>
      <div className="h-screen grid grid-rows-12">
        {isChatting && (
          <div className="row-span-10 flex flex-col border rounded-xl gap-0.5">
            <div className="flex w-full p-1 gap-0.5 ">
              <button
                className="border bg-gray-300 hover:bg-gray-500 hover:text-white rounded-md w-full"
                onClick={handleIsChatClick}
              >
                <span>채팅</span>
              </button>
              <button
                className="border bg-gray-300 hover:bg-gray-500 hover:text-white rounded-md w-full"
                onClick={handleIsSummaryClick}
              >
                <span>요약</span>
              </button>
            </div>
            {isChatStatus && (
              <>
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">채팅창 부분</div>
                <div className="flex flex-row gap-2 p-3 border-t border-gray-200 items-end">
                  <input
                    className="border rounded-xl h-7 pl-2"
                    type="text"
                    placeholder="메시지를 입력하세요"
                    onChange={handleMessageChange}
                  />
                  <button
                    className="w-7 h-7 rounded-2xl bg-blue-400 hover:bg-blue-600 flex justify-center items-center"
                    onClick={handleSendMessage}
                  >
                    <img className="w-5 h-5" src={send} alt="" />
                  </button>
                </div>
              </>
            )}
            {!isChatStatus && (
              <>
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">ㅇㅁㅇ</div>
              </>
            )}
          </div>
        )}
        {!isChatting && (
          <>
            <div className="row-span-10 w-full flex flex-col border rounded-xl ">
              <div className="w-full">유저 목록</div>
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
