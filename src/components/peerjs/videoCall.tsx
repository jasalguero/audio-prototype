import { Button } from "flowbite-react";
import { useRef, useEffect } from "react";

export default function VideoCall({
  videoStream,
  onShareScreen
}: {
  videoStream: MediaStream | undefined;
  onShareScreen: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream, videoRef]);

  return (
    <div className="video-preview">
      <h2>Preview</h2>
      <video ref={videoRef} autoPlay />
      {videoStream ? <Button onClick={onShareScreen}>Share screen</Button> : null}
    </div>
  );
}
