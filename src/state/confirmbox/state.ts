import { ClientAction } from "state/action";

export type ConfirmBoxButtonHandler =
    (dontShowAgain: boolean) => ClientAction | ClientAction[] | null | undefined | void;
export type ConfirmBoxButtonAction = ConfirmBoxButtonHandler | ClientAction | ClientAction[];

export interface ConfirmBoxState {
    show: boolean,
    message: string | null,
    yes: string | null,
    no: string | null,
    cancel: string | null,
    onYes: ConfirmBoxButtonAction | null,
    onNo: ConfirmBoxButtonAction | null,
    onCancel: ConfirmBoxButtonAction | null,
    variant: string,
    dontShowAgain: string | null;
    dontShowAgainBox: boolean;
    parentOverlayId: string | undefined;
}
