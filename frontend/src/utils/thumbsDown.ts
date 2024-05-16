import { Finger, FingerCurl, FingerDirection, GestureDescription } from "fingerpose";

export const thumbsDownGesture = new GestureDescription("thumbs_down");

// Thumb
thumbsDownGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.VerticalDown, 0.75);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownLeft, 0.25);
thumbsDownGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalDownRight, 0.25);

// Index, Middle, Ring, Pinky
for (const finger of [Finger.Index, Finger.Middle, Finger.Ring, Finger.Pinky]) {
  thumbsDownGesture.addCurl(finger, FingerCurl.FullCurl, 1.0);
  thumbsDownGesture.addDirection(finger, FingerDirection.HorizontalLeft, 0.75);
  thumbsDownGesture.addDirection(finger, FingerDirection.DiagonalUpLeft, 0.25);
  thumbsDownGesture.addDirection(finger, FingerDirection.DiagonalUpRight, 0.25);
}
