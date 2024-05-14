import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const handsUpGesture = new GestureDescription("hands_up");

// Thumb
handsUpGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
handsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.25);
handsUpGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.25);

// Index, Middle, Ring, Pinky
for (const finger of [Finger.Middle, Finger.Ring, Finger.Index, Finger.Pinky]) {
  handsUpGesture.addCurl(finger, FingerCurl.NoCurl, 1.0);
  handsUpGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 0.25);
}
