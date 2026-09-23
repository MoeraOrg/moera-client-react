import { PrincipalValue } from "api";
import { RelNodeName } from "util/rel-node-name";

export interface RepostDialogState {
    show: boolean;
    nodeName: RelNodeName | string;
    fullName: string | null;
    postingId: string | null;
    heading: string | null;
    visible: PrincipalValue;
    submitting: boolean;
}
