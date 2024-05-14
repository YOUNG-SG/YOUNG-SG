import { DotsLoaderProps } from "@/types/Common";
import "./Loading.css";

// scale: 50, 75, 90, 95, 100, 105, 110, 125, 150
// 50 또는 100
// opacity: 0 -> 100 (5단위)

const DotsLoader: React.FC<DotsLoaderProps> = ({ scale, opacity }) => {
  return (
    <div className={`scale-${scale} opacity-${opacity}`}>
      <div id="dots">
        <div className="dot" />
        <div className="dot" />
        <div className="dot" />
      </div>
    </div>
  );
};

export default DotsLoader;
