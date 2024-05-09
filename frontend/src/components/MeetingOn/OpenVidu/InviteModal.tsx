import { baseURL } from "@/services/axios";

interface InviteModalProps {
  sessionId: string;
  toggleInvite: () => void;
}

const InviteModal = ({ sessionId, toggleInvite }: InviteModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="p-5 w-[400px] h-[200px] " style={{ backgroundColor: "rgb(54, 57, 63)" }}>
        <div
          style={{ color: "rgb(250, 250, 250)" }}
          className="w-[300px] text-white font-bold text-xl mb-4"
        >
          초대 URL:
        </div>

        <div className="">
          <input
            type="text"
            readOnly
            className="text-white p-2 rounded-lg text-lg w-full"
            value={`${baseURL}/meeting/on/${sessionId}`}
            style={{
              backgroundColor: "rgb(43, 46, 51)",
              color: "rgb(200, 201, 202)",
              border: "rgb(39, 41, 46)",
            }}
          />
        </div>
        <div className="mt-4 justify-end flex">
          <button
            className="mt-4 p-2  text-white rounded"
            onClick={toggleInvite}
            style={{ backgroundColor: "rgb(114, 137, 218)" }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
