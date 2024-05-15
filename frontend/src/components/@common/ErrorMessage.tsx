import { ErrorMessageProps } from "@/types/Common";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-[#CCCCCC]">
      {children}
    </div>
  );
};

export default ErrorMessage;
