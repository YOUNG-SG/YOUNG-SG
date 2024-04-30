import React from "react";
import { Publisher } from "openvidu-browser";

interface ToggleAudioButtonProps {
  publisher: Publisher;
  isAudioEnabled: boolean;
  setIsAudioEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleAudioButton = ({
  publisher,
  isAudioEnabled,
  setIsAudioEnabled,
}: ToggleAudioButtonProps) => {
  const toggleAudio = () => {
    const newAudioState = !isAudioEnabled;
    publisher.publishAudio(newAudioState);
    setIsAudioEnabled(newAudioState);
  };

  return (
    <button onClick={toggleAudio}>{isAudioEnabled ? "Mute" : "Unmute"}</button>
  );
};

export default ToggleAudioButton;
