import { SheriffOrderInfo } from "api/node/api-types";

export interface SheriffOrderDetailsDialogState {
    show: boolean;
    loaded: boolean;
    loading: boolean;
    nodeName: string | null;
    id: string | null;
    info: SheriffOrderInfo | null;
}
