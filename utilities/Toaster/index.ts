import {IToaster, IToastOptions, Position, Toaster as BlueprintToaster} from "@blueprintjs/core";

// This variable will eventually point to a singleton.
// tslint:disable-next-line variable-name
let Toaster: IToaster;

if (typeof document !== "undefined") {
  Toaster = BlueprintToaster.create({
    position: Position.BOTTOM_RIGHT,
  });
} else {
  Toaster = {
    /* Purposefully blank */
    show: (): string => "",
    update: (): void => undefined,
    dismiss: (): void => undefined,
    clear: (): void => undefined,
    getToasts: (): IToastOptions[] => [],
  };
}

export {Toaster};
