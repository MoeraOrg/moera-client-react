import { actionWithoutPayload, ActionWithoutPayload, actionWithPayload, ActionWithPayload } from "state/action-types";
import { FundraiserInfo } from "api";

export type OpenDonateDialogAction = ActionWithPayload<"OPEN_DONATE_DIALOG", {
    name: string;
    fullName: string | null;
    fundraisers: FundraiserInfo[];
}>;
export const openDonateDialog = (
    name: string, fullName: string | null, fundraisers: FundraiserInfo[]
): OpenDonateDialogAction =>
    actionWithPayload("OPEN_DONATE_DIALOG", {name, fullName, fundraisers});

export type CloseDonateDialogAction = ActionWithoutPayload<"CLOSE_DONATE_DIALOG">;
export const closeDonateDialog = (): CloseDonateDialogAction =>
    actionWithoutPayload("CLOSE_DONATE_DIALOG");

export type DonateDialogAnyAction =
    OpenDonateDialogAction
    | CloseDonateDialogAction;
