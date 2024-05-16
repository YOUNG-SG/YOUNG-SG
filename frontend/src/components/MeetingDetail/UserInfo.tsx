import { UserInfoProps } from "@/types/MeetingDetail";

const UserInfo: React.FC<UserInfoProps> = (user) => {
  return (
    <div className="flex gap-[10px] items-center">
      <img src={user.profileImg} className="w-[32px] h-[32px] rounded-full" />
      <div className="text-[20px] font-b">
        {user.nickName.length > 5 ? user.nickName.slice(0, 5) + "··" : user.nickName}
      </div>
    </div>
  );
};

export default UserInfo;
