export type SignUpStage = 0 | 1 | 2 | 3 | 4;

export interface SignUpState {
    processing: boolean;
    stage: SignUpStage;
    name: string | null;
    domain: string | null;
    password: string | null;
    email: string | null;
    backHref: string;
}
