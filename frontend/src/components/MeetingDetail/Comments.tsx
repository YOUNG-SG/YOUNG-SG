import Comment from "@/components/MeetingDetail/Comment";
import { fetchComments, createComment } from "@/services/MeetingDetail";
import { CommentType } from "@/components/MeetingDetail/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Loading from "../@common/Loading";

const Comments = () => {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const { id: meetingDetailId } = useParams<string>();

  const { data: res, isLoading } = useQuery({
    queryKey: ["comments", meetingDetailId],
    queryFn: () => fetchComments(meetingDetailId!),
  });

  const { mutate: postComment } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", meetingDetailId!] });
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      className="w-full flex flex-col gap-[20px] justify-between"
      style={{ height: "calc(100% - 60px" }}
    >
      {/* 댓글조회 */}
      <div className="w-full flex flex-col gap-[16px] overflow-scroll">
        {res?.data.map((comment: CommentType) => (
          <Comment
            key={comment.commentId}
            comment={comment}
            myMemberId={res.currentMemberId}
            meetingDetailId={meetingDetailId}
          />
        ))}
      </div>

      {/* 댓글작성 */}
      <div className="flex min-h-[98px] gap-[8px]">
        <textarea
          className="flex-[10] bg-[#000000] bg-opacity-30 resize-none focus:outline-none rounded-lg p-[10px]"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
        <div
          className="flex-[1] flex bg-[#000000] bg-opacity-50 hover:bg-opacity-30 justify-center items-center rounded-lg cursor-pointer"
          onClick={() => {
            try {
              postComment({ meetingId: meetingDetailId!, content: content });
              setContent("");
            } catch (err) {
              console.log(err);
            }
          }}
        >
          작성
        </div>
      </div>
    </div>
  );
};

export default Comments;
