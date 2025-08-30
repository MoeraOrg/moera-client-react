import React, { Suspense, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedNotViewed, getFeedState, getInstantBorder } from "state/feeds/selectors";
import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import { REL_HOME } from "util/rel-node-name";

const InstantsPopover = React.lazy(() => import("ui/instant/InstantsPopover"));

export default function InstantButton() {
    const stories = useSelector((state: ClientState) => getFeedState(state, REL_HOME, "instant").stories);
    const notViewedCount = useSelector((state: ClientState) => getFeedNotViewed(state, REL_HOME, "instant"));
    const instantBorder = useSelector(getInstantBorder);
    const dispatch = useDispatch();

    const visible = useRef<boolean>(false);
    const topMoment = useRef<number>(Number.MIN_SAFE_INTEGER);

    const [border, setBorder] = useState<number>(Number.MAX_SAFE_INTEGER);

    const viewAll = () => {
        if (document.visibilityState !== "visible" || !visible.current || stories == null || stories.length === 0
            || notViewedCount === 0 || topMoment.current === stories[0].moment) {

            return;
        }
        topMoment.current = stories[0].moment;
        dispatch(feedStatusUpdate(REL_HOME, "instant", true, null, topMoment.current));
    }

    const onToggle = (v: boolean) => {
        if (v && visible.current !== v) {
            setBorder(instantBorder);
        }
        visible.current = v;
        viewAll();
    }

    return (
        <Suspense fallback={<InstantBell/>}>
            <Popover element={InstantBell} className="instant-popover" detached offset={[0, 10]} onToggle={onToggle}>
                <InstantsPopover instantBorder={border}/>
            </Popover>
        </Suspense>
    );
}
