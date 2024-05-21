import crown from "../../../../assets/chattingIcons/crown.png";
import { meetingChangeOwner } from "@/services/Chatting";
import useMeetingStore from "@/store/meetingStore";
interface Member {
  id: number;
  nickname: string;
  profile: string;
}

interface ChatProps {
  userList?: Member[];
  roomId: number;
  owner: string | null;
}

const UserList = ({ userList, roomId, owner }: ChatProps) => {
  const { username } = useMeetingStore();
  const isOwner = owner === username;

  const clickOwnerChange = async (ownerId: number) => {
    const confirmChange = confirm("방장의 권한을 넘기시겠습니까?");
    if (confirmChange) {
      try {
        await meetingChangeOwner(ownerId, roomId);
        console.log("방장 변경");
      } catch (err) {
        console.error("Failed to change owner:", err);
      }
    } else {
      console.log("변경 취소");
    }
  };
  return (
    <>
      <div className="p-2 flex flex-col">
        <div className="self-center border-b-2">참여자 목록</div>
        <div>
          {userList &&
            userList.map((user, index) => (
              <div key={index} className="flex flex-row items-center">
                {user.nickname === username ? (
                  <div>{user.nickname}</div>
                ) : (
                  <div
                    className={`${isOwner ? "cursor-pointer" : ""} pr-2`}
                    onClick={isOwner ? () => clickOwnerChange(user.id) : undefined}
                  >
                    {user.nickname}
                  </div>
                )}
                {user.nickname === owner && <img className="w-5 h-5" src={crown} alt="crown" />}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default UserList;
