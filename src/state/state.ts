import { CartesState } from "state/cartes/state";
import { ChangeDateDialogState } from "state/changedatedialog/state";
import { ComposeState } from "state/compose/state";
import { ConfirmBoxState } from "state/confirmbox/state";
import { ConnectDialogState } from "state/connectdialog/state";
import { ContactsState } from "state/contacts/state";
import { DetailedPostingState } from "state/detailedposting/state";
import { ErrorState } from "state/error/state";
import { FeedsState } from "state/feeds/state";
import { HomeState } from "state/home/state";
import { FlashBoxState } from "state/flashbox/state";
import { MessageBoxState } from "state/messagebox/state";
import { NamingState } from "state/naming/state";

export interface ClientState {
    cartes: CartesState;
    changeDateDialog: ChangeDateDialogState;
    compose: ComposeState;
    confirmBox: ConfirmBoxState;
    connectDialog: ConnectDialogState;
    contacts: ContactsState;
    detailedPosting: DetailedPostingState;
    error: ErrorState;
    feeds: FeedsState;
    flashBox: FlashBoxState;
    home: HomeState;
    messageBox: MessageBoxState;
    naming: NamingState;
}
