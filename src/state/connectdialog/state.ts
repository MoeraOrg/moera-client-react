import { ConnectDialogForm } from "state/connectdialog/actions";

export interface ConnectDialogState {
    show: boolean;
    location: string;
    login: string;
    form: ConnectDialogForm;
    resettingPassword: boolean;
    emailHint: string;
}
