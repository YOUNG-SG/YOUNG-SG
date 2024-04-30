import { useState } from "react";
import send from "../../../assets/chattingIcons/send.png";
import chat from "../../../assets/chattingIcons/messenger.png";
import people from "../../../assets/chattingIcons/people.png";

const Chatting = () => {
  // isChat이면 채팅창, false이면 사용자 목록
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [isChatStatus, setIsChatStatus] = useState<boolean>(false);

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

  return (
    <>
      <div className="h-full">
        {isChatting && (
          <div className="h-[90%] flex flex-col border rounded-xl gap-0.5">
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
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">챝창 부분</div>
                <div className="flex flex-row gap-2 p-3 border-t border-gray-200 items-end">
                  <input
                    className="border rounded-xl h-7 pl-2"
                    type="text"
                    placeholder="메시지를 입력하세요"
                  />
                  <button className="w-7 h-7 rounded-2xl bg-blue-400 hover:bg-blue-600 flex justify-center items-center">
                    <img className="w-5 h-5" src={send} alt="" />
                  </button>
                </div>
              </>
            )}
            {!isChatStatus && (
              <>
                <div className="flex-1 m-1 overflow-y-auto rounded-xl">요약 부분</div>
                <div className="flex flex-row gap-1 p-3  border-t border-gray-200 items-end">
                  <input
                    className="pl-2 border rounded-xl h-7"
                    type="text"
                    placeholder="메시지를 입력하세요"
                  />
                  <button className="w-7 h-7 rounded-2xl bg-blue-400 hover:bg-blue-600 flex justify-center items-center">
                    <img className="w-5 h-5" src={send} alt="" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {!isChatting && (
          <>
            <div className="h-[90%] w-full flex flex-col border rounded-xl bg-white">
              <div className="w-full">users</div>
            </div>
          </>
        )}
        {/* 버튼들 */}
        <div className="h-[10%] flex gap-2 justify-end">
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
