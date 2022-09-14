import {IconName, Intent} from "@blueprintjs/core";
import {Toaster} from "utilities";

export const notifySuccess = (message: string) => {
  notify({message, intent: Intent.SUCCESS, iconName: "tick"});
};

export const notifyWarning = (message: string) => {
  notify({message, intent: Intent.WARNING, iconName: "warning-sign"});
};

export const notifyDanger = (message: string) => {
  notify({message, intent: Intent.DANGER, iconName: "locate"});
};

interface NotifyParams {
  message: string;
  intent: Intent;
  iconName: IconName;
}

export const notify = ({message, intent, iconName}: NotifyParams) => {
  Toaster.show({message, intent, iconName});
};
