// 손가락 관절에 대한 포인트 설정
interface FingerJoints {
  thumb: number[];
  indexFinger: number[];
  middleFinger: number[];
  ringFinger: number[];
  pinky: number[];
}

const fingerJoints: FingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

// Infinity Gauntlet 스타일 설정
interface LandmarkStyle {
  color: string;
  size: number;
}

const style: Record<number, LandmarkStyle> = {
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

// 그리기 함수
interface Prediction {
  landmarks: [number, number][];
}

export const drawHand = (predictions: Prediction[], ctx: CanvasRenderingContext2D) => {
  // 예측이 있는지 확인
  if (predictions.length > 0) {
    // 각 예측을 반복
    predictions.forEach((prediction) => {
      // 랜드마크 가져오기
      const landmarks = prediction.landmarks;

      // 손가락 반복
      for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
        const finger = Object.keys(fingerJoints)[j];
        // 관절 쌍 반복
        for (let k = 0; k < fingerJoints[finger as keyof FingerJoints].length - 1; k++) {
          // 관절 쌍 가져오기
          const firstJointIndex = fingerJoints[finger as keyof FingerJoints][k];
          const secondJointIndex = fingerJoints[finger as keyof FingerJoints][k + 1];

          // 경로 그리기
          ctx.beginPath();
          ctx.moveTo(landmarks[firstJointIndex][0], landmarks[firstJointIndex][1]);
          ctx.lineTo(landmarks[secondJointIndex][0], landmarks[secondJointIndex][1]);
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // 랜드마크 반복 및 그리기
      for (let i = 0; i < landmarks.length; i++) {
        // x 포인트 가져오기
        const x = landmarks[i][0];
        // y 포인트 가져오기
        const y = landmarks[i][1];
        // 그리기 시작
        ctx.beginPath();
        ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);

        // 선 색상 설정
        ctx.fillStyle = style[i]["color"];
        ctx.fill();
      }
    });
  }
};
