import { Features } from "api/node/api-types";

export interface NodeState {
    root: {
        location: string | null;
        page: string | null;
        api: string | null;
        events: string | null;
    },
    features: Features | null;
}
