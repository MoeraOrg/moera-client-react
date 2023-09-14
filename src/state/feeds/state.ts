import { FeedInfo, FeedStatus, StoryInfo } from "api";

export interface ExtStoryInfo extends Omit<StoryInfo, "feedName" | "posting" | "comment"> {
    hideSheriffMarked?: boolean;
}

export interface FeedState extends Omit<FeedInfo, "feedName"> {
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    loadingStatus: boolean;
    loadedStatus: boolean;
    status: FeedStatus;
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    stories: ExtStoryInfo[];
    totalInPast: number;
    totalInFuture: number;
    anchor: number | null;
    scrollingActive: boolean;
    at: number;
}

export type FeedsState = Partial<Record<string, FeedState>>;
