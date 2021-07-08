import { CartesAnyAction } from "state/cartes/actions";
import { ChangeDateDialogAnyAction } from "state/changedatedialog/actions";
import { ComposeAnyAction } from "state/compose/actions";
import { ConfirmBoxAnyAction } from "state/confirmbox/actions";
import { ConnectDialogAnyAction } from "state/connectdialog/actions";
import { ContactsAnyAction } from "state/contacts/actions";
import { DetailedPostingAnyAction } from "state/detailedposting/actions";
import { ErrorAnyAction } from "state/error/actions";
import { FeedsAnyAction } from "state/feeds/actions";
import { FlashBoxAnyAction } from "state/flashbox/actions";
import { HomeAnyAction } from "state/home/actions";
import { MessageBoxAnyAction } from "state/messagebox/actions";
import { NamingAnyAction } from "state/naming/actions";

export type ClientAction =
    CartesAnyAction
    | ChangeDateDialogAnyAction
    | ComposeAnyAction
    | ConfirmBoxAnyAction
    | ConnectDialogAnyAction
    | ContactsAnyAction
    | DetailedPostingAnyAction
    | ErrorAnyAction
    | FeedsAnyAction
    | FlashBoxAnyAction
    | HomeAnyAction
    | MessageBoxAnyAction
    | NamingAnyAction;

export type ClientActionType = ClientAction["type"];
