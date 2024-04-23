// store/meetingStore.js
import create from "zustand";
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
  setSession: (session: OVSession | null) => void;
  setSessionId: (sessionId: string) => void;
  setSubscriber: (subscriber: Subscriber | null) => void;
  setPublisher: (publisher: Publisher | null) => void;
  setIsAudioEnabled: (isAudioEnabled: boolean) => void;
  setIsVideoEnabled: (isVideoEnabled: boolean) => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  session: null,
  sessionId: "",
  subscriber: null,
  publisher: null,
  isAudioEnabled: true,
  isVideoEnabled: true,
  setSession: (session) => set({ session }),
  setSessionId: (sessionId) => set({ sessionId }),
  setSubscriber: (subscriber) => set({ subscriber }),
  setPublisher: (publisher) => set({ publisher }),
  setIsAudioEnabled: (isAudioEnabled) => set({ isAudioEnabled }),
  setIsVideoEnabled: (isVideoEnabled) => set({ isVideoEnabled }),
}));

export default useMeetingStore;
