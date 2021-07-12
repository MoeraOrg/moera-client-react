import { CartesState } from "state/cartes/state";
import { ChangeDateDialogState } from "state/changedatedialog/state";
import { ComposeState } from "state/compose/state";

export interface ClientState {
    cartes: CartesState;
    changeDateDialog: ChangeDateDialogState;
    compose: ComposeState;
}
