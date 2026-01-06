import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  return (
    <Tooltip title={isFullscreen ? "Exit Full Screen" : "Full Screen"}>
      <div className="head-icon" onClick={toggleFullscreen}>
        {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: { xs: 20, md: 22 } }} /> : <FullscreenIcon sx={{ fontSize: { xs: 20, md: 22 } }} />}
      </div>
    </Tooltip>
  );
};

export default FullScreen;
