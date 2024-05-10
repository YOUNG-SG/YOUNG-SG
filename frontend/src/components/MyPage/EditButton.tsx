import { editModeStore } from "@/store/myPageStore";
import { EditButtonProps } from "@/types/MyPage";

const EditButton: React.FC<EditButtonProps> = ({ handleEditProfile }) => {
  const { editMode, setEditMode } = editModeStore();

  if (editMode) {
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
          onClick={handleEditProfile}
          // onClick={() => {
          //   handleEditProfile;
          //   setEditMode(false);
          // }}
        >
          완료
        </u>
      </div>
    );
  }
  // else {
  //   return (
  //     <div className="w-full flex justify-end mr-[30px] text-[14px] gap-[6px]">
  //       <u
  //         className="cursor-pointer"
  //         onClick={() => {
  //           setEditMode(true);
  //         }}
  //       >
  //         수정
  //       </u>
  //     </div>
  //   );
  // }
};

export default EditButton;
