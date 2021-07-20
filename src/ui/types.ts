import { FeedReference } from "api/node/api-types";

export type NameDisplayMode = "name" | "full-name" | "both";

export type MinimalStoryInfo = FeedReference & { id: string };
