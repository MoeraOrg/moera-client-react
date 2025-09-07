import { TFunction } from 'i18next';

export function getFeedTitle(feedName: string | null | undefined, t?: TFunction): string {
    const te = t ?? ((text: string) => text);
    switch (feedName) {
        case "timeline":
            return te("feed-title.timeline");
        case "news":
            return te("feed-title.news");
        case null:
        case undefined:
            return te("feed-title.timeline");
        default:
            return feedName;
    }
}
