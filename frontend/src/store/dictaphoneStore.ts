import { create } from "zustand";

interface dictaphoneState {
  recordMessage: string | null;
  transcript: string | null;
  listening: boolean;

  setRecordMessage: (recordMessage: string | null) => void;
  setTranscript: (transcript: string | null) => void;
  setListening: (listening: boolean) => void;
  resetTranscript: () => void;
}

const useDictaphoneStore = create<dictaphoneState>((set) => ({
  recordMessage: "",
  transcript: "",
  listening: false,

  setRecordMessage: (recordMessage) => set({ recordMessage }),
  setTranscript: (transcript) => set({ transcript }),
  setListening: (listening) => set({ listening }),
  resetTranscript: () => set({ transcript: "" }),
}));

export default useDictaphoneStore;
