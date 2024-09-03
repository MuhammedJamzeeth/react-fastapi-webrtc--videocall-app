import { useRef, useEffect } from "react";
import useCamera from "../hooks/useCamera";

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const { stream, error, getCameraStream } = useCamera({
    video: true,
    audio: false,
  });

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Convert error to a string if it is an object
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "An unknown error occurred.";

  return (
    <div className="flex w-full">
      {error ? (
        <div className="error">
          <p>{errorMessage}</p>
          <p>
            Please check your camera settings or try restarting your browser.
          </p>
          <button onClick={getCameraStream}>Retry</button>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: "100%", height: "auto" }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
