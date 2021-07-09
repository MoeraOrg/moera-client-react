export const PAGE_TIMELINE = "timeline";
export const PAGE_PROFILE = "profile";
export const PAGE_DETAILED_POSTING = "detailedposting";
export const PAGE_COMPOSE = "compose";
export const PAGE_SETTINGS = "settings";
export const PAGE_NEWS = "news";
export const PAGE_PEOPLE = "people";

export type Page =
    typeof PAGE_TIMELINE
    | typeof PAGE_PROFILE
    | typeof PAGE_DETAILED_POSTING
    | typeof PAGE_COMPOSE
    | typeof PAGE_SETTINGS
    | typeof PAGE_NEWS
    | typeof PAGE_PEOPLE;
