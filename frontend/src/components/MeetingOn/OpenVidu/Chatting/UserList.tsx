import crown from "../../../../assets/chattingIcons/crown.png";

interface ChatTestProps {
  userList?: string[];
  owner: string | null;
}

const UserList = ({ userList, owner }: ChatTestProps) => {
  console.log(userList);
  return (
    <>
      <div className="p-2 flex flex-col">
        <div className="self-center border-b-2">참여자 목록</div>
        <div>
          {userList &&
            userList.map((user, index) => (
              <div key={index} className="flex flex-row items-center">
                <div className="pr-2">{user}</div>
                {user === owner ? <img className="w-5 h-5" src={crown} alt="" /> : null}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default UserList;
