const UserInfo: React.FC<{ img: string; nickname: string }> = (user) => {
  return (
    <div className="flex gap-[10px] items-center">
      <img src={user.img} className="w-[32px] h-[32px] rounded-full" />
      <div className="text-[20px] font-b">{user.nickname}</div>
    </div>
  );
};

export default UserInfo;
