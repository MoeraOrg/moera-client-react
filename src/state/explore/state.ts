import { RecommendedNodeInfo, RecommendedPostingInfo } from "api";

export interface ExploreState {
    loadingActivePeople: boolean;
    loadedActivePeople: boolean;
    activePeople: RecommendedNodeInfo[];
    loadingTrending: boolean;
    loadedTrending: boolean;
    trending: RecommendedPostingInfo[];
    loadingDiscussions: boolean;
    loadedDiscussions: boolean;
    discussions: RecommendedPostingInfo[];
}
