import crown from "../../../../assets/chattingIcons/crown.png";
import { meetingChangeOwner } from "@/services/Chatting";
interface Member {
  id: number;
  nickname: string;
  profile: string;
}

interface ChatTestProps {
  userList?: Member[];
  owner: string | null;
  roomId: number;
}

const UserList = ({ userList, owner, roomId }: ChatTestProps) => {
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
                {user.nickname === owner ? (
                  <div className="pr-2">{user.nickname}</div>
                ) : (
                  <div onClick={() => clickOwnerChange(user.id)} className="pr-2 cursor-pointer">
                    {user.nickname}
                  </div>
                )}
                {user.nickname === owner ? <img className="w-5 h-5" src={crown} alt="" /> : null}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default UserList;
