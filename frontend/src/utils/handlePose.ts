// 각 손가락 마디 포인트 정의
const fingerJoints: Record<string, number[]> = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet 스타일 정의
interface Style {
  color: string;
  size: number;
}

const style: Record<number, Style> = {
  0: { color: "yellow", size: 15 },
  1: { color: "gold", size: 6 },
  2: { color: "green", size: 10 },
  3: { color: "gold", size: 6 },
  4: { color: "gold", size: 6 },
  5: { color: "purple", size: 10 },
  6: { color: "gold", size: 6 },
  7: { color: "gold", size: 6 },
  8: { color: "gold", size: 6 },
  9: { color: "blue", size: 10 },
  10: { color: "gold", size: 6 },
  11: { color: "gold", size: 6 },
  12: { color: "gold", size: 6 },
  13: { color: "red", size: 10 },
  14: { color: "gold", size: 6 },
  15: { color: "gold", size: 6 },
  16: { color: "gold", size: 6 },
  17: { color: "orange", size: 10 },
  18: { color: "gold", size: 6 },
  19: { color: "gold", size: 6 },
  20: { color: "gold", size: 6 },
};

// 예측 타입 정의
interface Landmark {
  x: number;
  y: number;
}

interface Prediction {
  landmarks: Landmark[];
}

// 그리기 함수 정의
export const drawHand = (predictions: Prediction[], ctx: CanvasRenderingContext2D): void => {
  // 예측이 있는지 확인
  if (predictions.length > 0) {
    // 각 예측을 반복 처리
    predictions.forEach((prediction) => {
      // 랜드마크 가져오기
      const landmarks = prediction.landmarks;

      // 각 손가락을 반복 처리
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        // 각 손가락의 마디 쌍을 반복 처리
        for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
          // 마디 쌍 가져오기
          const firstJointIndex = fingerJoints[finger][k];
          const secondJointIndex = fingerJoints[finger][k + 1];

          // 경로 그리기
          ctx.beginPath();
          ctx.moveTo(landmarks[firstJointIndex].x, landmarks[firstJointIndex].y);
          ctx.lineTo(landmarks[secondJointIndex].x, landmarks[secondJointIndex].y);
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // 각 랜드마크를 반복 처리하고 그리기
      for (let i = 0; i < landmarks.length; i++) {
        // x 좌표 가져오기
        const x = landmarks[i].x;
        // y 좌표 가져오기
        const y = landmarks[i].y;
        // 그리기 시작
        ctx.beginPath();
        ctx.arc(x, y, style[i].size, 0, 3 * Math.PI);

        // 색상 설정
        ctx.fillStyle = style[i].color;
        ctx.fill();
      }
    });
  }
};
