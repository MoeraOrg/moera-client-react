import { Features } from "api";

export interface NodeState {
    root: {
        location: string | null;
        page: string | null;
        api: string | null;
        events: string | null;
    },
    owner: {
        name: string | null;
        correct: boolean;
        verified: boolean;
        verifiedAt: number;
        changing: boolean;
        showNavigator: boolean;
        switching: boolean;
    },
    features: Features | null;
}
