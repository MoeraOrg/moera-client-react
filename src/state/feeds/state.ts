import { FeedInfo, FeedStatus, StoryInfo } from "api/node/api-types";

export interface ExtStoryInfo extends Omit<StoryInfo, "feedName" | "posting" | "comment"> {
    postingId?: string;
    commentId?: string;
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
