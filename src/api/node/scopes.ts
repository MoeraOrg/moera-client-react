import { Scope } from "api";

export const SCOPES: Scope[] = [
    "view-media",
    "upload-public-media",
    "upload-private-media",
    "view-content",
    "add-post",
    "update-post",
    "add-comment",
    "update-comment",
    "react",
    "delete-own-content",
    "delete-others-content",
    "view-people",
    "subscribe",
    "friend",
    "block",
    "remote-identify",
    "drafts",
    "view-feeds",
    "update-feeds",
    "name",
    "plugins",
    "view-profile",
    "update-profile",
    "sheriff",
    "view-settings",
    "update-settings",
    "tokens",
    "user-lists",
    "grant",
    "other"
];

export const SCOPES_VIEW_ALL: Scope[] = [
    "view-media",
    "view-content",
    "view-people",
    "view-feeds",
    "view-profile"
];
