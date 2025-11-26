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
    | "connect"
    | "signup"
    | "mnemonic"
    | "start-reading"
    | "email-verified"
    | "verify-email";

export const GLOBAL_PAGES: Page[] = [
    "removal", "grant", "connect", "signup", "mnemonic", "start-reading", "email-verified", "verify-email"
];
