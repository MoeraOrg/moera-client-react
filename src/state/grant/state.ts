import { Scope } from "api";

export interface GrantState {
    clientName: string;
    carte: string;
    scopes: Scope[];
    redirectUri: string | null;
    validated: boolean;
    valid: boolean;
    validationError: string | null;
    confirming: boolean;
    confirmed: boolean;
}
