import { RecommendedNodeInfo } from "api";

export interface ExploreState {
    loadingActivePeople: boolean;
    loadedActivePeople: boolean;
    activePeople: RecommendedNodeInfo[];
}
