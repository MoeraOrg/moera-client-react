import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faThumbtack } from '@fortawesome/free-solid-svg-icons';

import { feedScrollToAnchor } from "state/feeds/actions";
import { RelNodeName } from "util/rel-node-name";
import { PINNED_TIME } from "util/misc";
import { getPageHeaderHeight } from "util/ui";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;

}

export default function FeedSkipPinnedButton({nodeName, feedName}: Props) {
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(isAtPinned);

    const onScroll = useCallback(
        () => {
            const atPinned = isAtPinned();
            if (visible !== atPinned) {
                setVisible(atPinned);
            }
        },
        [visible]
    );

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [onScroll]);

    if (!visible) {
        return null;
    }

    const onClick = (event: React.MouseEvent) => {
        dispatch(feedScrollToAnchor(nodeName, feedName, PINNED_TIME));
        event.preventDefault();
    };

    return (
        <div className="feed-top-button ms-2" onClick={onClick}>
            <FontAwesomeIcon icon={faThumbtack} size="sm"/>
            <FontAwesomeIcon icon={faArrowDown} className="ms-1"/>
        </div>
    );
}

function postingMoment(posting: HTMLElement | null): number {
    return posting?.dataset.moment != null ? parseInt(posting.dataset.moment) : 0;
}

function isAtPinned(): boolean {
    const headerHeight = getPageHeaderHeight() + 40;
    const postings = document.getElementsByClassName("posting");
    for (let i = 0; i < postings.length; i++) {
        const posting = postings.item(i) as HTMLElement;
        if (postingMoment(posting) < PINNED_TIME) {
            return false;
        }
        const rect = posting.getBoundingClientRect();
        if (rect.bottom > headerHeight) {
            return true;
        }
    }
    return false;
}
