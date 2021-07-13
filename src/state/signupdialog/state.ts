import { SignUpStage } from "state/signupdialog/actions";

export interface SignUpDialogState {
    show: boolean;
    processing: boolean;
    stage: SignUpStage;
    name: string | null;
    domain: string | null;
    password: string | null;
    email: string | null;
}
