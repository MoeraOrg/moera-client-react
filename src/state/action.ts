import { CartesAction } from "state/cartes/actions";
import { ChangeDateDialogAction } from "state/changedatedialog/actions";
import { ComposeAction } from "state/compose/actions";

export type ClientAction =
    CartesAction
    | ChangeDateDialogAction
    | ComposeAction;
