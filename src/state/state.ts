import { CartesState } from "state/cartes/state";
import { ChangeDateDialogState } from "state/changedatedialog/state";
import { ComposeState } from "state/compose/state";
import { ConfirmBoxState } from "state/confirmbox/state";
import { ConnectDialogState } from "state/connectdialog/state";
import { ContactsState } from "state/contacts/state";
import { DetailedPostingState } from "state/detailedposting/state";

export interface ClientState {
    cartes: CartesState;
    changeDateDialog: ChangeDateDialogState;
    compose: ComposeState;
    confirmBox: ConfirmBoxState;
    connectDialog: ConnectDialogState;
    contacts: ContactsState;
    detailedPosting: DetailedPostingState;
}
