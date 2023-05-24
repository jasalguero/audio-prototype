import { useRef, useEffect } from "react";

export default function VideoCall({
  videoStream,
}: {
  videoStream: MediaStream | undefined;
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
    </div>
  );
}
