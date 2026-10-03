import { SharingInfo } from "api";
import { RelNodeName } from "util/rel-node-name";

export interface SharingsDialogState {
    show: boolean;
    nodeName: RelNodeName | string;
    postingId: string | null;
    loading: boolean;
    loaded: boolean;
    after: number;
    total: number;
    items: SharingInfo[];
}
