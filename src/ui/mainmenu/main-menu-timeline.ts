import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { goToTimeline } from "state/navigation/actions";
import { isAtTimelinePage, isStandaloneMode } from "state/navigation/selectors";
import { getFeedState } from "state/feeds/selectors";
import { getNodeRootLocation } from "state/node/selectors";
import { Browser } from "ui/browser";

interface MainMenuTimelineProps {
    active: boolean;
    href: string;
    onClick: (event: React.MouseEvent) => void;
}

export default function useMainMenuTimeline(): MainMenuTimelineProps {
    const {standalone, rootLocation, active, anchor} = useSelector((state: ClientState) => ({
        standalone: isStandaloneMode(state),
        rootLocation: getNodeRootLocation(state),
        active: isAtTimelinePage(state),
        anchor: getFeedState(state, "timeline").anchor
    }))
    const dispatch = useDispatch();

    let href = anchor != null ? `${rootLocation}/timeline?before=${anchor}` : rootLocation + "/timeline";
    href = !standalone ? href : Browser.passedLocation(href);
    const onClick = (event: React.MouseEvent) => {
        dispatch(goToTimeline(active ? Number.MAX_SAFE_INTEGER : anchor));
        event.preventDefault();
    };
    return {active, href, onClick};
}
