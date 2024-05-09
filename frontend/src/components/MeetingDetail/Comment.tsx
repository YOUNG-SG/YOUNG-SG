import UserInfo from "./UserInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "@/services/MeetingDetail";
import { CommentType } from "@/types/MeetingDetail";

const Comment: React.FC<{
  comment: CommentType;
  meetingDetailId: string | undefined;
  myMemberId: number;
}> = ({ comment, meetingDetailId, myMemberId }) => {
  const queryClient = useQueryClient();
  // const comment = props.comment;
  const isWriter = myMemberId === comment.memberId;

  const { mutate: delComment } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", meetingDetailId] });
    },
  });

  return (
    <div className="flex w-full justify-between">
      <div className="w-[160px]">
        <UserInfo profileImg={comment.profileUrl} nickName={comment.nickname} />
      </div>
      <div className="text-[20px] mt-[1px] font-l" style={{ width: "calc(100% - 190px)" }}>
        {comment.content}
      </div>
      {isWriter && (
        <div
          className="w-[30px] min-w-[30px] mt-[4px] text-[12px] font-l cursor-pointer"
          onClick={() => {
            if (confirm("댓글을 삭제하시겠어요?")) {
              delComment(comment.commentId);
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
