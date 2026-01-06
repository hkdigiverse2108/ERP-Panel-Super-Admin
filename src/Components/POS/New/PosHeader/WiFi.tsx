import WifiOffIcon from "@mui/icons-material/WifiOff";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import WifiIcon from '@mui/icons-material/Wifi';

const WiFi = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  return (
    <Tooltip title="No Internet Connection">
      <div className="head-icon">
        {isOnline ? <WifiIcon sx={{ fontSize: { xs: 20, md: 22 }, color: "green" }} /> : <WifiOffIcon sx={{ fontSize: { xs: 20, md: 22 }, color: "red" }} />}
      </div>
    </Tooltip>
  );
};

export default WiFi;
