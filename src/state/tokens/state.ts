export interface TokenState {
    token: string;
    permissions: string[];
}

export type TokensState = Partial<Record<string, TokenState>>;
