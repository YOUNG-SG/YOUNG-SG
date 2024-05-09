const UserInfo: React.FC<{ profileImg: string; nickName: string }> = (user) => {
  return (
    <div className="flex gap-[10px] items-center">
      <img src={user.profileImg} className="w-[32px] h-[32px] rounded-full" />
      <div className="text-[20px] font-b">{user.nickName}</div>
    </div>
  );
};

export default UserInfo;
