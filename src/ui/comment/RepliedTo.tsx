import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { glanceComment } from "state/detailedposting/actions";
import { isGlanceCommentByIdToBeLoaded } from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import * as Browser from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import Jump from "ui/navigation/Jump";
import { DelayedPopover } from "ui/control";
import { Icon, msReplySolid } from "ui/material-symbols";
import GlanceComment from "ui/comment/GlanceComment";
import "./RepliedTo.css";

interface Props {
    postingId: string;
    commentId: string | null;
    ownerName: string;
    ownerFullName: string | null;
    headingHtml: string;
    disabled?: boolean;
    unset: boolean;
    onUnset?: (() => void) | null;
}

export default function RepliedTo({
    postingId, commentId, ownerName, ownerFullName, headingHtml, disabled, unset, onUnset
}: Props) {
    const popperEnabled = useSelector(
        (state: ClientState) => getSetting(state, "comment.replied-to.glance.enabled")
    ) as boolean && !Browser.isTouchScreen();
    const glanceToBeLoaded = useSelector((state: ClientState) => isGlanceCommentByIdToBeLoaded(state, commentId));
    const dispatch = useDispatch();

    if (commentId == null) {
        return null;
    }

    const onPreparePopper = () => {
        if (glanceToBeLoaded) {
            dispatch(glanceComment(commentId));
        }
    }

    const onUnsetClick = () => onUnset && onUnset();

    return (
        <div className="replied-to">
            {unset && <button className="unset" disabled={disabled} onClick={onUnsetClick}>&times;</button>}
            <Jump href={`/post/${postingId}?comment=${commentId}`}>
                <span className="icon"><Icon icon={msReplySolid} size="1.2em"/></span>
                <NodeName name={ownerName} fullName={ownerFullName} linked={false}/>
            </Jump>
            <DelayedPopover placement="top" className="glance-comment-popover" onPreparePopper={onPreparePopper}
                            disabled={!popperEnabled} element={
                ref =>
                    <Jump href={`/post/${postingId}?comment=${commentId}`} ref={ref}>
                        <span className="heading" dangerouslySetInnerHTML={{__html: headingHtml}}/>
                    </Jump>
            }>
                <GlanceComment/>
            </DelayedPopover>
        </div>
    );
}
