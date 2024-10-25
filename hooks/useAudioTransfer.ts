'use client';

import { atom, useAtom } from 'jotai';

const audioDataAtom = atom<{
  audioBlob: Blob | null;
  audioUrl: string | null;
}>({
  audioBlob: null,
  audioUrl: null
});

export default function useAudioTransfer() {
  const [audioData, setAudioData] = useAtom(audioDataAtom);

  const setAudioBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioData({ audioBlob: blob, audioUrl: url });
  };

  const clearAudioData = () => {
    if (audioData.audioUrl) {
      URL.revokeObjectURL(audioData.audioUrl);
    }
    setAudioData({ audioBlob: null, audioUrl: null });
  };

  return {
    audioBlob: audioData.audioBlob,
    audioUrl: audioData.audioUrl,
    setAudioData: setAudioBlob,
    clearAudioData
  };
}