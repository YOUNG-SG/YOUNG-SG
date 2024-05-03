import { useState } from "react";
import { fetchMyProfile } from "@/services/MyPage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChangeImage from "@/assets/MyPage/PencilSimpleLine.svg?react";
import { updateMyProfile } from "@/services/MyPage";
import { editModeStore } from "@/store/myPageStore";

const ProfileEdit = () => {
  /* store */
  const { setEditMode } = editModeStore();

  /* tanstack query */
  const {
    data: myProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => fetchMyProfile(),
  });

  const queryClient = useQueryClient();
  const { mutate: editProfile } = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });

  /* 닉네임, 프리뷰, 업로드 파일이미지 */
  const [nickname, setNickname] = useState(myProfile.nickname);
  const [preview, setPreview] = useState(myProfile.image);
  const [file, setFile] = useState<File | null>(null);

  if (isLoading) {
    return (
      <div className="min-w-[240px] h-full py-[40px] flex flex-col items-center bg-[#777777] bg-opacity-30"></div>
    );
  }

  if (error) {
    return <div>{error.message}</div>;
  }

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
