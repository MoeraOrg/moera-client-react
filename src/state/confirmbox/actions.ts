import { ActionBase } from "state/action-base";

export const CONFIRM_BOX = "CONFIRM_BOX" as const;
type ConfirmBoxAction = ActionBase<typeof CONFIRM_BOX, {
    message: string;
    yes: string;
    no: string;
    onYes: any;
    onNo: any;
    variant: string;
}>;
export const confirmBox = (message: string, yes: string = "Yes", no: string = "No", onYes: any = null, onNo: any = null,
                           variant: string = "primary"): ConfirmBoxAction => ({
    type: CONFIRM_BOX,
    payload: {message, yes, no, onYes, onNo, variant}
});

export const CLOSE_CONFIRM_BOX = "CLOSE_CONFIRM_BOX" as const;
type CloseConfirmBoxAction = ActionBase<typeof CLOSE_CONFIRM_BOX, never>;
export const closeConfirmBox = (): CloseConfirmBoxAction => ({
    type: CLOSE_CONFIRM_BOX
});

export type ConfirmBoxAnyAction =
    ConfirmBoxAction
    | CloseConfirmBoxAction;
