import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    console.log(stream);
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

VideoPlayer.propTypes = {
  stream: PropTypes.instanceOf(MediaStream),
};

export default VideoPlayer;
