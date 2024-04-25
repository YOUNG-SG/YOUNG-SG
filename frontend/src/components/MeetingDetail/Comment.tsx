import UserInfo from "./UserInfo";

type CommentType = {
  profile: string;
  nickname: string;
  content: string;
  isWriter: boolean;
};

const Comment: React.FC<{ comment: CommentType }> = (props) => {
  const comment = props.comment;

  return (
    <div className="flex w-full justify-between">
      <div className="w-[160px]">
        <UserInfo img={comment.profile} nickname={comment.nickname} />
      </div>
      <div className="text-[20px] mt-[1px] font-l" style={{ width: "calc(100% - 190px)" }}>
        {comment.content}
      </div>
      {comment.isWriter && (
        <div
          className="w-[30px] min-w-[30px] mt-[4px] text-[12px] font-l cursor-pointer"
          onClick={() => {
            if (confirm("댓글을 삭제하시겠어요?")) {
              // [API] 삭제
            }
          }}
        >
          삭제
        </div>
      )}
    </div>
  );
};

export default Comment;
