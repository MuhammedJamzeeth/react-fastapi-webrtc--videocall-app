import { useEffect, useState } from "react";

const useCamera = (constraints) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const getCameraStream = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err.name === "NotAllowedError") {
        // Handle user denying access
        setError("Camera access has been denied.");
      } else if (err.name === "NotFoundError") {
        // Handle no camera found
        setError("No camera device found.");
      } else if (err.name === "NotReadableError") {
        // Handle camera is already in use
        setError("Camera is currently in use by another application.");
      } else {
        // Handle other errors
        setError("An unknown error occurred.");
      }
      setStream(null);
      setError(err);
    }
  };
  useEffect(() => {
    getCameraStream();
  }, []);

  return { stream, error, getCameraStream };
};

export default useCamera;
