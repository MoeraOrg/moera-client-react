import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNewsPage, isAtTimelinePage } from "state/navigation/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getFeedAt, getFeedNotViewedMoment, getFeedState } from "state/feeds/selectors";

interface MainMenuTimelineProps {
    active: boolean;
    href: string;
}

export function useMainMenuTimeline(): MainMenuTimelineProps {
    const active = useSelector(isAtTimelinePage);
    const anchor = useSelector((state: ClientState) => getFeedState(state, "timeline").anchor);
    const href = anchor != null ? `/timeline?before=${anchor}` : "/timeline"
    return useMemo(() => ({active, href}), [active, href]);
}

interface MainMenuHomeNewsProps {
    active: boolean;
    href: string;
}

export function useMainMenuHomeNews(): MainMenuHomeNewsProps {
    const atHome = useSelector(isAtHomeNode);
    const atNews = useSelector(isAtNewsPage);
    const moment = useSelector((state: ClientState) => getFeedNotViewedMoment(state, ":news"));
    const feedAt = useSelector((state: ClientState) => getFeedAt(state, "news")); // not ":news"!
    const targetStory = useSelector((state: ClientState) => getSetting(state, "news-button.target-story") as string);

    let href = "/news";
    if (targetStory === "earliest-new") {
        if (atHome) {
            if (moment != null && (feedAt > moment || atNews)) {
                href += `?before=${moment}`;
            }
        } else if (moment != null) {
            href += `?before=${moment}`;
        }
    }

    return useMemo(() => ({active: atHome && atNews, href}), [atHome, atNews, href]);
}
