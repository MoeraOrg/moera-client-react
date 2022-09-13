import i18n from 'i18next';

export function getFeedTitle(feedName: string | null | undefined): string {
    switch (feedName) {
        case "timeline":
            return i18n.t("feed.title.timeline");
        case "news":
            return i18n.t("feed.title.news");
        case null:
        case undefined:
            return i18n.t("feed.title.timeline");
        default:
            return feedName;
    }
}
