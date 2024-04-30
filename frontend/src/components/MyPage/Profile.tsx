import { useEffect, useState } from "react";
import { fetchMyProfile } from "@/services/MyPage";
import { useQuery } from "@tanstack/react-query";
import testImg from "@/assets/@test/profile.jpg";
import ChangeImage from "@/assets/MyPage/PencilSimpleLine.svg?react";

// FIXME (확인) 이미지 변경시 navbar 이미지 변경
const Profile = () => {
  const {
    data: myProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  const [isEdit, setIsEdit] = useState(false);
  const [nickname, setNickname] = useState("닉네임");
  const [image, setImage] = useState(testImg);

  useEffect(() => {
    if (myProfile) {
      setNickname(myProfile.nickname);
      setImage(myProfile.image);
    }
  }, [myProfile]);

  if (isLoading) {
    return (
      <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30"></div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const EditBtn = () => {
    return (
      <div className="w-full flex justify-end mr-[30px] text-[14px] gap-[6px]">
        {isEdit && (
          <div
            className="font-[#CCCCCC] opacity-80 cursor-pointer"
            onClick={() => {
              if (confirm("프로필 수정을 취소하시겠어요?")) {
                setIsEdit(false);
              }
            }}
          >
            취소
          </div>
        )}
        <u
          className="cursor-pointer"
          onClick={() => {
            if (isEdit) {
              // [API] 바뀐 닉네임 저장
            }
            setIsEdit(!isEdit);
          }}
        >
          {isEdit ? "완료" : "수정"}
        </u>
      </div>
    );
  };

  const changeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setImage(URL.createObjectURL(newFile));
    }
  };

  return (
    <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
      <EditBtn />
      <div className="relative">
        <img
          src={image}
          className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]"
        />
        {isEdit && (
          <>
            <label
              className="absolute right-[12px] bottom-[30px] w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#000000] bg-opacity-80 cursor-pointer"
              htmlFor="profileImg"
            >
              <ChangeImage className="w-[20px] h-[20px]" />
            </label>
            <input id="profileImg" type="file" className="hidden" onChange={changeProfileImage} />
          </>
        )}
      </div>

      {isEdit ? (
        <input
          type="text"
          className="w-[130px] h-[35px] rounded-md text-[18px] px-[10px] bg-e-30 focus:outline-none"
          value={nickname}
          onChange={(event) => {
            setNickname(event.target.value);
          }}
        />
      ) : (
        <div>
          <span className="text-[24px] font-bold">
            {nickname.length > 5 ? nickname.slice(0, 5) + "··" : nickname}
          </span>
          <span className="text-[20px] font-[#CCCCCC]">님</span>
        </div>
      )}
      <u className="text-[14px] fixed bottom-[40px]">로그아웃</u>
    </div>
  );
};

export default Profile;
