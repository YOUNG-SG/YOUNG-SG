import { useRef, useEffect } from "react";

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
}

const ChatSummary = ({ summaryMessages }: SummaryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [summaryMessages]);

  return (
    <>
      <div>
        {summaryMessages.map((msg, index) => (
          <div key={index} className="p-2 flex" ref={messagesEndRef}>
            {msg.contentType === "application/json" ? (
              <>
                <div className="inline-block max-w-xs px-4 py-2 rounded-lg">
                  <div>{msg.sender}</div>
                  <div>{msg.content}</div>
                  <div className="text-sm text-gray-300">{msg.sent_time}</div>
                </div>
              </>
            ) : (
              <div className="inline-block max-w-xs px-3 py-2 rounded-lg text-center bg-[#333]">
                <div>{msg.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatSummary;
