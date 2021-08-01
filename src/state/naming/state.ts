export interface NameState {
    accessed: number;
    updated: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

export interface NamingState {
    names: Partial<Record<string, NameState>>;
}
