export type Page =
    "timeline"
    | "profile"
    | "detailedposting"
    | "compose"
    | "settings"
    | "news"
    | "people"
    | "complaints"
    | "removal"
    | "grant"
    | "search"
    | "explore"
    | "activepeople"
    | "instants"
    | "connect";

export const GLOBAL_PAGES: Page[] = ["removal", "grant", "connect"];
