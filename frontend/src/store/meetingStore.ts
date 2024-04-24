import { create } from "zustand";
import {
  OpenVidu,
  Session as OVSession,
  Publisher,
  Subscriber,
} from "openvidu-browser";

interface MeetingState {
  session: OVSession | null;
  sessionId: string;
  subscriber: Subscriber | null;
  publisher: Publisher | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  OV: OpenVidu | null;

  setSession: (session: OVSession | null) => void;
  setSessionId: (sessionId: string) => void;
  setSubscriber: (subscriber: Subscriber | null) => void;
  setPublisher: (publisher: Publisher | null) => void;
  setIsAudioEnabled: (isAudioEnabled: boolean) => void;
  setIsVideoEnabled: (isVideoEnabled: boolean) => void;
  setOV: (OV: OpenVidu | null) => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  session: null,
  sessionId: "",
  subscriber: null,
  publisher: null,
  isAudioEnabled: true,
  isVideoEnabled: true,
  OV: null,
  setSession: (session) => set({ session }),
  setSessionId: (sessionId) => set({ sessionId }),
  setSubscriber: (subscriber) => set({ subscriber }),
  setPublisher: (publisher) => set({ publisher }),
  setIsAudioEnabled: (isAudioEnabled) => set({ isAudioEnabled }),
  setIsVideoEnabled: (isVideoEnabled) => set({ isVideoEnabled }),
  setOV: (OV) => set({ OV }),
}));

export default useMeetingStore;
