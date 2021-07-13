export interface NameState {
    accessed: number;
    loading: boolean;
    loaded: boolean;
    nodeUri: string | null;
}

export interface NamingState {
    names: Record<string, NameState>;
}
