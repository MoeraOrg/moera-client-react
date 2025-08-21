import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNewsPage, isAtTimelinePage } from "state/navigation/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getFeedAt, getFeedNotViewedMoment, getFeedState } from "state/feeds/selectors";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";

interface MainMenuTimelineProps {
    active: boolean;
    href: string;
}

export function useMainMenuTimeline(): MainMenuTimelineProps {
    const active = useSelector(isAtTimelinePage);
    const anchor = useSelector((state: ClientState) => getFeedState(state, REL_CURRENT, "timeline").anchor);
    const href = anchor != null ? `/timeline?before=${anchor}` : "/timeline"
    return useMemo(() => ({active, href}), [active, href]);
}

interface MainMenuHomeNewsProps {
    active: boolean;
    href: string;
}

export function useMainMenuHomeNews(): MainMenuHomeNewsProps {
    const atHomeNews = useSelector((state: ClientState) => isAtHomeNode(state) && isAtNewsPage(state));
    const moment = useSelector((state: ClientState) => getFeedNotViewedMoment(state, REL_HOME, "news"));
    const feedAt = useSelector((state: ClientState) => getFeedAt(state, REL_HOME, "news"));
    const targetStory = useSelector((state: ClientState) => getSetting(state, "news-button.target-story") as string);

    let href = "/news";
    if (targetStory === "earliest-new" && moment != null && (feedAt > moment || atHomeNews)) {
        href += `?before=${moment}`;
    }

    return useMemo(() => ({active: atHomeNews, href}), [atHomeNews, href]);
}
