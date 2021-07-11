import { CartesState } from "state/cartes/state";
import { ChangeDateDialogState } from "state/changedatedialog/state";

export interface ClientState {
    cartes: CartesState;
    changeDateDialog: ChangeDateDialogState;
}
