export interface NameState {
    accessed: number;
    updated: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

export interface NamingState {
    serverUrl: string | null;
    names: Partial<Record<string, NameState>>;
}
