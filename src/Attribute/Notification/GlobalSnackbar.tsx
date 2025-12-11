import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import type { MuiNotificationType } from "../../Types";
import { SubscribeNotification } from "./ToastNotification";

export const GlobalSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState<MuiNotificationType>("info");

  useEffect(() => {
    SubscribeNotification((message, notificationType) => {
      setMsg(message);
      setType(notificationType);
      setOpen(true);
    });
  }, []);

  return (
    <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }} onClose={() => setOpen(false)}>
      <Alert onClose={() => setOpen(false)} severity={type} variant="filled">
        {msg}
      </Alert>
    </Snackbar>
  );
};
