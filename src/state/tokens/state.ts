export interface TokenState {
    token: string;
    permissions: string[];
}

export type TokensState = Record<string, TokenState>;
