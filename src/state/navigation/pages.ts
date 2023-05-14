export const PAGE_TIMELINE = "timeline" as const;
export const PAGE_PROFILE = "profile" as const;
export const PAGE_DETAILED_POSTING = "detailedposting" as const;
export const PAGE_COMPOSE = "compose" as const;
export const PAGE_SETTINGS = "settings" as const;
export const PAGE_NEWS = "news" as const;
export const PAGE_PEOPLE = "people" as const;
export const PAGE_COMPLAINS = "complains" as const;

export type Page =
    typeof PAGE_TIMELINE
    | typeof PAGE_PROFILE
    | typeof PAGE_DETAILED_POSTING
    | typeof PAGE_COMPOSE
    | typeof PAGE_SETTINGS
    | typeof PAGE_NEWS
    | typeof PAGE_PEOPLE
    | typeof PAGE_COMPLAINS;
