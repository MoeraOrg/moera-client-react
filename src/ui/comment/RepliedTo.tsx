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

class RepliedTo extends React.PureComponent<Props> {

    onPreparePopper = () => {
        if (this.props.commentId != null) {
            this.props.glanceComment(this.props.commentId);
        }
    }

    onUnset = () => {
        if (this.props.onUnset != null) {
            this.props.onUnset();
        }
    }

    render() {
        const {postingId, commentId, ownerName, ownerFullName, headingHtml, unset, popperEnabled} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <div className="replied-to">
                {unset && <button className="unset" onClick={this.onUnset}>&times;</button>}
                <Manager onPreparePopper={this.onPreparePopper} disabled={!popperEnabled}>
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

}

const connector = connect(
    (state: ClientState) => ({
        popperEnabled: getSetting(state, "comment.replied-to.glance.enabled") as boolean && !Browser.isTouchScreen()
    }),
    { glanceComment }
);

export default connector(RepliedTo);
