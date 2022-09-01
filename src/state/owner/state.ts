export interface OwnerState {
    name: string | null;
    correct: boolean;
    verified: boolean;
    verifiedAt: number;
    changing: boolean;
    showNavigator: boolean;
    switching: boolean;
}
