import { Features } from "api";

export interface NodeState {
    introduced: boolean;
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
        switching: boolean;
    },
    features: Features | null;
}
