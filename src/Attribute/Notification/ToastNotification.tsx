import type { MuiNotificationType } from "../../Types";

let listener: ((msg: string, type: MuiNotificationType) => void) | null = null;

export const ShowNotification = (message: string, type: MuiNotificationType = "info") => {
  listener?.(message, type);
};

export const SubscribeNotification = (fn: (msg: string, type: MuiNotificationType) => void) => {
  listener = fn;
};
