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
    const {active, anchor} = useSelector((state: ClientState) => ({
        active: isAtTimelinePage(state),
        anchor: getFeedState(state, "timeline").anchor
    }))

    const href = anchor != null ? `/timeline?before=${anchor}` : "/timeline";
    return {active, href};
}

interface MainMenuHomeNewsProps {
    active: boolean;
    href: string;
}

export function useMainMenuHomeNews(): MainMenuHomeNewsProps {
    const {atHome, atHomeNews, moment, atBeginning, targetStory} = useSelector((state: ClientState) => ({
        atHome: isAtHomeNode(state),
        atHomeNews: isAtHomeNode(state) && isAtNewsPage(state),
        moment: getFeedNotViewedMoment(state, ":news"),
        atBeginning: isFeedAtBeginning(state, "news"), // not ":news"!
        targetStory: getSetting(state, "news-button.target-story") as string
    }))

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

    return {active: atHomeNews, href};
}
