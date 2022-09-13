export function getFeedTitle(feedName: string | null | undefined): string {
    switch (feedName) {
        case "timeline":
            return "Timeline";
        case "news":
            return "News";
        case null:
        case undefined:
            return "Timeline";
        default:
            return feedName;
    }
}
