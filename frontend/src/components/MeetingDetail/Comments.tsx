import testProfile from "@/assets/@test/profile.jpg";

import Comment from "@/components/MeetingDetail/Comment";
import { useState } from "react";

const Comments = () => {
  const [content, setContent] = useState("");
  const cmt = {
    profile: testProfile,
    nickname: "유미의세포",
    content: "댓글내용".repeat(20),
    isWriter: true,
  };

  return (
    <div
      className="w-full flex flex-col gap-[20px] justify-between"
      style={{ height: "calc(100% - 60px" }}
    >
      {/* 댓글조회 */}
      <div className="w-full flex flex-col gap-[16px] overflow-scroll">
        <Comment comment={cmt} />
        <Comment comment={cmt} />
      </div>

      {/* 댓글작성 */}
      <div className="flex min-h-[98px] gap-[8px]">
        <textarea
          className="flex-[10] bg-[#000000] bg-opacity-30 resize-none focus:outline-none rounded-lg p-[10px]"
          onChange={(e) => {
            setContent(e.target.value);
          }}
        ></textarea>
        <div
          className="flex-[1] flex bg-[#000000] bg-opacity-50 justify-center items-center rounded-lg cursor-pointer"
          onClick={() => {
            console.log(content);
          }}
        >
          작성
        </div>
      </div>
    </div>
  );
};

export default Comments;
