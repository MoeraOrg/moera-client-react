import { StoryInfo } from "api/node/api-types";

export interface ExtStoryInfo extends Omit<StoryInfo, "feedName" | "posting" | "comment"> {
    postingId?: string;
    commentId?: string;
}

export interface FeedState {
    loadingGeneral: boolean;
    loadedGeneral: boolean;
    subscribing: boolean;
    unsubscribing: boolean;
    subscriberId: string | null;
    operations: {
        add: string[];
    }
    loadingStatus: boolean;
    loadedStatus: boolean;
    notViewed: number;
    notRead: number;
    loadingFuture: boolean;
    loadingPast: boolean;
    before: number;
    after: number;
    stories: ExtStoryInfo[];
    anchor: number | null;
    scrollingActive: boolean;
    at: number;
}

export type FeedsState = Record<string, FeedState>;
