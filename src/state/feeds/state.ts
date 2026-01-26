import { FeedInfo, FeedStatus, StoryInfo } from "api";

export interface ExtStoryInfo extends Omit<StoryInfo, "feedName" | "posting" | "comment"> {
    hideSheriffMarked?: boolean;
}

export interface FeedSlice {
    stories: StoryInfo[];
    before: number;
    after: number;
    totalInPast: number;
    totalInFuture: number;
}

export interface FeedState extends Omit<FeedInfo, "feedName"> {
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    loadingStatus: boolean;
    loadedStatus: boolean;
    status: FeedStatus;
    loadingFuture: boolean;
    loadingPast: boolean;
    cannotBeLoaded: boolean;
    before: number;
    after: number;
    stories: ExtStoryInfo[];
    pending: FeedSlice[];
    totalInPast: number;
    totalInFuture: number;
    anchor: number | null;
    scrollingActive: boolean;
    at: number;
}

type NodeFeedsState = Partial<Record<string, FeedState>>;

export type FeedsState = Partial<Record<string, NodeFeedsState>>;
