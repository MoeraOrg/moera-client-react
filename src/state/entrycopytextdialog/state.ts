import { Body } from "api/node/api-types";

export interface EntryCopyTextDialogState {
    show: boolean;
    body: Body | null;
}
