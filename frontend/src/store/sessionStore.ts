// store/sessionStore.js
import create from "zustand";
import {
  Session as OVSession,
  Publisher,
  Subscriber,
  PublisherProperties,
} from "openvidu-browser";

interface SessionState {
  sessionId: string;
  session: OVSession | null;
  publisher: Publisher | null;
  subscriber: Subscriber | null;
  publisherOptions: PublisherProperties;
  isAudioEnabled: boolean;
  setSessionId: (id: string) => void;
  setSession: (session: OVSession | null) => void;
  setPublisher: (publisher: Publisher | null) => void;
  setSubscriber: (subscriber: Subscriber | null) => void;
  setPublisherOptions: (options: PublisherProperties) => void;
  toggleScreenShare: () => void;
  // setIsAudioEnabled: () => void;
}

const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: "",
  session: null,
  publisher: null,
  subscriber: null,
  publisherOptions: {
    audioSource: undefined,
    videoSource: undefined,
    publishAudio: true,
    publishVideo: true,
    mirror: false,
  },
  isAudioEnabled: false,
  setSessionId: (id) => set({ sessionId: id }),
  setSession: (session) => set({ session }),
  setPublisher: (publisher) => set({ publisher }),
  setSubscriber: (subscriber) => set({ subscriber }),
  setPublisherOptions: (options) =>
    set((state) => ({
      publisherOptions: { ...state.publisherOptions, ...options },
    })),
  toggleScreenShare: () => {
    const currentOptions = get().publisherOptions;
    const isScreenSharing = currentOptions.videoSource === "screen";
    set({
      publisherOptions: {
        ...currentOptions,
        videoSource: isScreenSharing ? undefined : "screen",
        audioSource: isScreenSharing ? undefined : "screen",
      },
    });
  },
}));

export default useSessionStore;
