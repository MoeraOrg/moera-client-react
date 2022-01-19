import { Action } from 'redux';

import { ActionWithPayload } from "state/action-types";
import { FundraiserInfo } from "api/node/api-types";

export const OPEN_DONATE_DIALOG = "OPEN_DONATE_DIALOG";
export type OpenDonateDialogAction = ActionWithPayload<typeof OPEN_DONATE_DIALOG, {
    name: string;
    fullName: string | null;
    fundraisers: FundraiserInfo[];
}>;
export const openDonateDialog = (name: string, fullName: string | null,
                                 fundraisers: FundraiserInfo[]): OpenDonateDialogAction => ({
    type: OPEN_DONATE_DIALOG,
    payload: {name, fullName, fundraisers}
});

export const CLOSE_DONATE_DIALOG = "CLOSE_DONATE_DIALOG";
export type CloseDonateDialogAction = Action<typeof CLOSE_DONATE_DIALOG>;
export const closeDonateDialog = (): CloseDonateDialogAction => ({
    type: CLOSE_DONATE_DIALOG
});

export type DonateDialogAnyAction =
    OpenDonateDialogAction
    | CloseDonateDialogAction;
