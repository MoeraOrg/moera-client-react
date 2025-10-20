export type ConnectDialogForm = "connect" | "forgot" | "verify" | "reset";

export interface ConnectDialogState {
    location: string;
    login: string;
    form: ConnectDialogForm;
    processing: boolean;
    emailHint: string;
    resetToken: string | null;
    backHref: string;
    lastError: string | null;
    formId: number;
    connectAfter: Date;
    mailAfter: Date;
}
