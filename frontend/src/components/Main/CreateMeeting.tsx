import { useNavigate } from "react-router-dom";
import { createRoom } from "@/services/Room";
import createRoomStore from "@/store/createRoomStore";
import userStore from "@/store/userStore";

const CreateMeeting = () => {
  const navigate = useNavigate();

  const { title, setTitle, setRoomId } = createRoomStore();
  const { setId, setName, setProfile } = userStore();
  const createChattingRoom = async () => {
    try {
      const { invite_code, roomId, sender, profile, sent_time, senderId } = await createRoom(title);
      setRoomId(roomId);
      setId(senderId);
      setName(sender);
      setProfile(profile);
      console.log(sent_time);
      // 이동
      navigate(`/meeting/on/${invite_code}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-[1100px] h-[600px] bg-e-20 rounded-lg backdrop-blur-10 flex flex-col justify-center items-center gap-[30px]">
      <div className="text-[36px] font-bold">회의 생성</div>
      <div className="w-[900px] h-[400px] bg-e-20 rounded-lg backdrop-blur-10 flex flex-col justify-center items-center gap-[90px]">
        <div className="flex items-center">
          <label htmlFor="meetingName" className="text-[30px] font-b pr-[40px]">
            회의명
          </label>
          {/* FIXME maxLength ? */}
          <input
            type="text"
            id="meetingName"
            className="w-[550px] h-[55px] rounded-lg text-[20px] px-[16px] bg-e-30 focus:outline-none"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div
          className="flex justify-center items-center w-[280px] h-[50px] text-[24px] text-[#333333] font-bold bg-[#EEEEEE] bg-opacity-80 hover:bg-opacity-70 rounded-lg shadow-md cursor-pointer"
          // [API] 회의생성API & 회의코드 저장 & navigate 회의진행 페이지
          onClick={createChattingRoom}
        >
          생성
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
