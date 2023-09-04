import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNewsPage, isAtTimelinePage } from "state/navigation/selectors";
import { isAtHomeNode } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { getFeedNotViewedMoment, getFeedState, isFeedAtBeginning } from "state/feeds/selectors";

interface MainMenuTimelineProps {
    active: boolean;
    href: string;
}

export function useMainMenuTimeline(): MainMenuTimelineProps {
    const active = useSelector((state: ClientState) => isAtTimelinePage(state));
    const href = useSelector((state: ClientState) => {
        const anchor = getFeedState(state, "timeline").anchor;
        return anchor != null ? `/timeline?before=${anchor}` : "/timeline";
    });

    return {active, href};
}

interface MainMenuHomeNewsProps {
    active: boolean;
    href: string;
}

export function useMainMenuHomeNews(): MainMenuHomeNewsProps {
    const atHomeNews = useSelector((state: ClientState) => isAtHomeNode(state) && isAtNewsPage(state));
    const href = useSelector((state: ClientState) => {
        const atHome = isAtHomeNode(state);
        const moment = getFeedNotViewedMoment(state, ":news");
        const atBeginning = isFeedAtBeginning(state, "news"); // not ":news"!
        const targetStory = getSetting(state, "news-button.target-story") as string;

        let href = "/news";
        if (targetStory === "earliest-new") {
            if (atHome) {
                if ((atBeginning || atHomeNews) && moment != null) {
                    href += `?before=${moment}`;
                }
            } else if (moment) {
                href += `?before=${moment}`;
            }
        }

        return href;
    });


    return {active: atHomeNews, href};
}
