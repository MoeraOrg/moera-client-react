import { useSelector } from 'react-redux';

import { TFunction } from 'i18next';
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtNewsPage } from "state/navigation/selectors";
import { getSetting } from "state/settings/selectors";
import { getFeedAt, getFeedNotViewedMoment, getFeedState } from "state/feeds/selectors";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

export function getFeedTitle(feedName: string | null | undefined, t?: TFunction): string {
    const te = t ?? ((text: string) => text);
    switch (feedName) {
        case "timeline":
            return te("feed-title.timeline");
        case "news":
            return te("feed-title.news");
        case "explore":
            return te("feed-title.explore");
        case null:
        case undefined:
            return te("feed-title.timeline");
        default:
            return feedName;
    }
}

export function useTimeline(): string {
    const anchor = useSelector((state: ClientState) => getFeedState(state, REL_CURRENT, "timeline").anchor);
    return anchor != null ? `/timeline?before=${anchor}` : "/timeline"
}

export function useHomeNews(): string {
    const atHomeNews = useSelector((state: ClientState) => isAtHomeNode(state) && isAtNewsPage(state));
    const moment = useSelector((state: ClientState) => getFeedNotViewedMoment(state, REL_HOME, "news"));
    const feedAt = useSelector((state: ClientState) => getFeedAt(state, REL_HOME, "news"));
    const targetStory = useSelector((state: ClientState) => getSetting(state, "news-button.target-story") as string);

    let href = "/news";
    if (targetStory === "earliest-new" && moment != null && (feedAt > moment || atHomeNews)) {
        href += `?before=${moment}`;
    }

    return href;
}
