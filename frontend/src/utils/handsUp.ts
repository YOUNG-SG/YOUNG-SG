import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

// 손을 든 모양 제스처 정의 (Hands Up Gesture)
export const handsUpGesture = new GestureDescription("hands_up");

// Thumb
handsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
handsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
handsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75);
handsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);

// Index, Middle, Ring, Pinky
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  handsUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  handsUpGesture.addDirection(finger, FingerDirection.VerticalUp, 1.0);
  handsUpGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.75);
  handsUpGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.75);
}

// 손을 내린 모양 제스처 정의 (Hands Down Gesture)
export const handsDownGesture = new GestureDescription("hands_down");

// Thumb
handsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
handsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
handsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.75);
handsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.75);

// Index, Middle, Ring, Pinky
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  handsDownGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  handsDownGesture.addDirection(finger, FingerDirection.VerticalDown, 1.0);
  handsDownGesture.addDirection(finger, FingerDirection.DiagonalDownLeft, 0.75);
  handsDownGesture.addDirection(finger, FingerDirection.DiagonalDownRight, 0.75);
}

// 손가락으로 굿모양 제스처 정의 (Thumbs Up Gesture)
export const thumbsUpGesture = new GestureDescription("thumbs_up");

// Thumb
thumbsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 0.75);
thumbsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpRight, 0.75);

// Other fingers
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  thumbsUpGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  thumbsUpGesture.addDirection(finger, FingerDirection.HorizontalLeft, 0.5);
  thumbsUpGesture.addDirection(finger, FingerDirection.HorizontalRight, 0.5);
}

// 굿모양을 180도 회전한 제스처 정의 (Thumbs Down Gesture)
export const thumbsDownGesture = new GestureDescription("thumbs_down");

// Thumb
thumbsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 1.0);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.75);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.75);

// Other fingers
for (let finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  thumbsDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  thumbsDownGesture.addDirection(finger, FingerDirection.HorizontalLeft, 0.5);
  thumbsDownGesture.addDirection(finger, FingerDirection.HorizontalRight, 0.5);
}
