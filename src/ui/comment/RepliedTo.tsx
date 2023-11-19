import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { glanceComment } from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import Jump from "ui/navigation/Jump";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import GlanceComment from "ui/comment/GlanceComment";
import "./RepliedTo.css";

interface Props {
    postingId: string;
    commentId: string | null;
    ownerName: string;
    ownerFullName: string | null;
    headingHtml: string;
    unset: boolean;
    onUnset?: (() => void) | null;
}

export default function RepliedTo({
    postingId, commentId, ownerName, ownerFullName, headingHtml, unset, onUnset
}: Props) {
    const popperEnabled = useSelector(
        (state: ClientState) => getSetting(state, "comment.replied-to.glance.enabled")
    ) as boolean && !Browser.isTouchScreen();
    const dispatch = useDispatch();

    if (commentId == null) {
        return null;
    }

    const onPreparePopper = () => dispatch(glanceComment(commentId));

    const onUnsetClick = () => onUnset && onUnset();

    return (
        <div className="replied-to">
            {unset && <button className="unset" onClick={onUnsetClick}>&times;</button>}
            <Manager onPreparePopper={onPreparePopper} disabled={!popperEnabled}>
                <Reference>
                    {(ref, mainEnter, mainLeave, mainTouch) =>
                        <Jump href={`/post/${postingId}?comment=${commentId}`} anchorRef={ref}
                              onMouseEnter={mainEnter} onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                            <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                            <NodeName name={ownerName} fullName={ownerFullName} linked={false}/>
                            <span className="heading" dangerouslySetInnerHTML={{__html: headingHtml}}/>
                        </Jump>
                    }
                </Reference>
                <DelayedPopper placement="top" className="glance-comment-popover">
                    <GlanceComment/>
                </DelayedPopper>
            </Manager>
        </div>
    );
}
