import { SkeletonLoaderProps } from "@/types/Common";
import "./Loading.css";

// round : lg(사각형) or full(원형)
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ round, w, h, opacity }) => {
  return (
    <div className={`opacity-${opacity}`}>
      <div className={`skeleton w-[${w}px] h-[${h}px] rounded-${round}`}></div>
    </div>
  );
};

export default SkeletonLoader;
