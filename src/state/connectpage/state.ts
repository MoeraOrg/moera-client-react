export type ConnectPageForm = "connect" | "forgot" | "verify" | "reset" | "change";

export interface ConnectPageState {
    location: string;
    login: string;
    form: ConnectPageForm;
    processing: boolean;
    emailHint: string;
    resetToken: string | null;
    backHref: string;
    lastError: string | null;
    formId: number;
    connectAfter: Date;
    mailAfter: Date;
}
