interface SummaryMessage {
  content: string;
  sender?: string;
  profile?: string;
  senderId?: number;
  sent_time?: string;
  contentType?: string;
}

interface SummaryProps {
  summaryMessages: SummaryMessage[];
  sendSummaryMessage: () => void;
}

const ChatSummary = ({ summaryMessages }: SummaryProps) => {
  return (
    <>
      <div>
        {summaryMessages.map((msg, index) => (
          <div key={index} className="p-2 flex">
            <div className="inline-block max-w-xs px-4 py-2 rounded-lg bg-[#333]">
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatSummary;
