import { TFunction } from "react-i18next";

export function getFeedTitle(feedName: string | null | undefined, t?: TFunction): string {
    t = t ?? ((text: string) => text);
    switch (feedName) {
        case "timeline":
            return t("feed.title.timeline");
        case "news":
            return t("feed.title.news");
        case null:
        case undefined:
            return t("feed.title.timeline");
        default:
            return feedName;
    }
}
