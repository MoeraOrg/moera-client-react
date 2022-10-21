import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
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

type Props = {
    postingId: string;
    commentId: string | null;
    ownerName: string;
    ownerFullName: string | null;
    headingHtml: string;
    unset: boolean;
    onUnset?: () => void | null;
} & ConnectedProps<typeof connector>;

function RepliedTo({
    postingId, commentId, ownerName, ownerFullName, headingHtml, unset, onUnset, popperEnabled, glanceComment
}: Props) {
    const onPreparePopper = () => {
        if (commentId != null) {
            glanceComment(commentId);
        }
    }

    const onUnsetClick = () => {
        if (onUnset != null) {
            onUnset();
        }
    }

    if (commentId == null) {
        return null;
    }

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

const connector = connect(
    (state: ClientState) => ({
        popperEnabled: getSetting(state, "comment.replied-to.glance.enabled") as boolean && !Browser.isTouchScreen()
    }),
    { glanceComment }
);

export default connector(RepliedTo);
