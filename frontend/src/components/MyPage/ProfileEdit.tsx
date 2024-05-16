import { useState } from "react";
import { fetchMyProfile } from "@/services/MyPage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChangeImage from "@/assets/MyPage/PencilSimpleLine.svg?react";
import { updateMyProfile } from "@/services/MyPage";
import { editModeStore } from "@/store/myPageStore";
import SkeletonLoader from "@/components/@common/SkeletonLoader";
import DefaultProfile from "@/assets/@common/Profile.svg?react";

const ProfileEdit = () => {
  /* store */
  const { setEditMode } = editModeStore();

  /* tanstack query */
  const {
    isLoading: getLoading,
    isError: getError,
    data: myProfile,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  const queryClient = useQueryClient();
  const { isError: editError, mutate: editProfile } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  /* 닉네임, 프리뷰, 업로드 파일이미지 */
  const [nickname, setNickname] = useState(myProfile.nickName);
  const [preview, setPreview] = useState(myProfile.profileImg);
  const [file, setFile] = useState<File | null>(null);

  function handleEditProfile() {
    const profile = new FormData();
    if (file) {
      profile.append("profileImg", file);
    }
    profile.append("nickname", nickname);

    try {
      editProfile(profile);
    } catch (err) {
      console.log(err);
    }
  }

  const EditButton = () => {
    return (
      <div className="w-full flex justify-end mr-[30px] text-[14px] gap-[6px]">
        <div
          className="font-[#CCCCCC] opacity-80 cursor-pointer"
          onClick={() => {
            if (confirm("프로필 수정을 취소하시겠어요?")) {
              setEditMode(false);
            }
          }}
        >
          취소
        </div>
        <u
          className="cursor-pointer"
          onClick={() => {
            if (nickname.length > 5) {
              alert("닉네임은 5글자 이하로 설정해주세요");
              return;
            }
            handleEditProfile();
            setEditMode(false);
          }}
        >
          완료
        </u>
      </div>
    );
  };

  const changeProfileImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setFile(newFile);
      setPreview(URL.createObjectURL(newFile));
    }
  };

  if (getError) {
    alert("오류가 발생했습니다");
    setEditMode(false);
  }

  if (editError) {
    alert("프로필 수정에 실패했습니다");
  }

  if (getLoading || getError) {
    return (
      <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
        <div className="h-[20px]"></div>
        {getLoading ? (
          <div className="mt-[15px] mb-[25px]">
            <SkeletonLoader round="full" w={140} h={140} />
          </div>
        ) : (
          <DefaultProfile className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]" />
        )}
        {getLoading ? <SkeletonLoader round="lg" w={140} h={40} /> : <></>}
      </div>
    );
  }

  return (
    <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30">
      <EditButton />
      <div className="relative">
        <img
          src={preview}
          className="w-[140px] h-[140px] rounded-full object-cover mt-[15px] mb-[25px]"
        />
        <>
          <label
            className="absolute right-[12px] bottom-[30px] w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#000000] bg-opacity-80 cursor-pointer"
            htmlFor="profileImg"
          >
            <ChangeImage className="w-[20px] h-[20px]" />
          </label>
          <input
            id="profileImg"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={changeProfileImage}
          />
        </>
      </div>

      <input
        type="text"
        className="w-[130px] h-[35px] rounded-md text-[18px] px-[10px] bg-e-30 focus:outline-none"
        value={nickname}
        onChange={(event) => {
          setNickname(event.target.value);
        }}
      />
    </div>
  );
};

export default ProfileEdit;
