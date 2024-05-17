import { create } from "zustand";
import { OpenVidu, Session as OVSession, Publisher, Subscriber } from "openvidu-browser";

interface MeetingState {
  session: OVSession | null;
  screenSession: OVSession | null;
  // sessionId: string;
  subscribers: Subscriber[];
  screenSubscribers: Subscriber[];
  publisher: Publisher | undefined;
  screenPublisher: Publisher | undefined;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  OV: OpenVidu | null;
  screenOV: OpenVidu | null;

  setSession: (session: OVSession | null) => void;
  setScreenSession: (session: OVSession | null) => void;
  // setSessionId: (sessionId: string) => void;
  setSubscribers: (subscriber: Subscriber[] | undefined) => void;
  setScreenSubscribers: (screenSubscriber: Subscriber[] | undefined) => void;
  setPublisher: (publisher: Publisher | undefined) => void;
  setScreenPublisher: (screenPublisher: Publisher | undefined) => void;
  setIsAudioEnabled: (isAudioEnabled: boolean) => void;
  setIsVideoEnabled: (isVideoEnabled: boolean) => void;
  setOV: (OV: OpenVidu | null) => void;
  setScreenOV: (screenOV: OpenVidu | null) => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  session: null,
  screenSession: null,
  // sessionId: "",
  subscribers: [],
  screenSubscribers: [],
  publisher: undefined,
  screenPublisher: undefined,
  isAudioEnabled: true,
  isVideoEnabled: true,
  OV: null,
  screenOV: null,

  setSession: (session) => set({ session }),
  setScreenSession: (screenSession) => set({ screenSession }),
  // setSessionId: (sessionId) => set({ sessionId }),
  setSubscribers: (subscribers) => set({ subscribers }),
  setScreenSubscribers: (screenSubscribers) => set({ screenSubscribers }),
  setPublisher: (publisher) => set({ publisher }),
  setScreenPublisher: (screenPublisher) => set({ screenPublisher }),
  setIsAudioEnabled: (isAudioEnabled) => set({ isAudioEnabled }),
  setIsVideoEnabled: (isVideoEnabled) => set({ isVideoEnabled }),
  setOV: (OV) => set({ OV }),
  setScreenOV: (screenOV) => set({ screenOV }),
}));

export default useMeetingStore;
