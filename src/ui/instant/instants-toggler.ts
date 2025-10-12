import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedNotViewed, getFeedState, getInstantBorder } from "state/feeds/selectors";
import { REL_HOME } from "util/rel-node-name";

export interface InstantsToggler {
    border: number;
    onToggle: (visible: boolean) => void;
}

export function useInstantsToggler(): InstantsToggler {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const notViewedCount = useSelector((state: ClientState) => getFeedNotViewed(state, REL_HOME, "instant"));
    const instantBorder = useSelector(getInstantBorder);
    const dispatch = useDispatch();

    const visible = useRef<boolean>(false);
    const topMoment = useRef<number>(Number.MIN_SAFE_INTEGER);
    const lastToggle = useRef<number>(0);

    const [border, setBorder] = useState<number>(Number.MAX_SAFE_INTEGER);

    const viewAll = useCallback(() => {
        if (
            document.visibilityState !== "visible"
            || !visible.current
            || stories == null
            || stories.length === 0
            || notViewedCount === 0
            || topMoment.current === stories[0].moment
        ) {
            return;
        }
        topMoment.current = stories[0].moment;
        dispatch(feedStatusUpdate(REL_HOME, "instant", true, null, topMoment.current));
    }, [dispatch, stories, notViewedCount]);

    // This effect is activated when the list of stories is changed. Visibility is checked in viewAll().
    useEffect(() => viewAll(), [viewAll]);

    const onToggle = useCallback((v: boolean) => {
        if (v && visible.current !== v) {
            if (Date.now() - lastToggle.current < 200) {
                return;
            }
            setBorder(instantBorder);
        }
        lastToggle.current = Date.now();
        visible.current = v;
        viewAll();
    }, [instantBorder, viewAll]);

    return {border, onToggle};
}
