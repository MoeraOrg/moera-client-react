export type ConnectDialogForm = "connect" | "forgot" | "reset";

export interface ConnectDialogState {
    show: boolean;
    location: string;
    login: string;
    form: ConnectDialogForm;
    resettingPassword: boolean;
    emailHint: string;
    backHref: string;
    lastError: string | null;
    formId: number;
}
