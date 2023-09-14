import { SheriffOrderInfo } from "api";

export interface SheriffOrderDetailsDialogState {
    show: boolean;
    loaded: boolean;
    loading: boolean;
    nodeName: string | null;
    id: string | null;
    info: SheriffOrderInfo | null;
}
