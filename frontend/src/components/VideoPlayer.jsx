import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={videoRef} autoPlay playsInline />;
};
VideoPlayer.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
};
export default VideoPlayer;
