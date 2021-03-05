import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { glanceComment } from "state/detailedposting/actions";
import { getSetting } from "state/settings/selectors";
import { Browser } from "ui/browser";
import NodeName from "ui/nodename/NodeName";
import Jump from "ui/navigation/Jump";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import GlanceComment from "ui/comment/GlanceComment";
import "./RepliedTo.css";

class RepliedTo extends React.PureComponent {

    static propTypes = {
        postingId: PropType.string,
        commentId: PropType.string,
        ownerName: PropType.string,
        ownerFullName: PropType.string,
        heading: PropType.string,
        unset: PropType.bool,
        onUnset: PropType.func,
        glanceComment: PropType.func
    };

    onPreparePopper = () => {
        this.props.glanceComment(this.props.commentId);
    }

    onUnset = () => {
        if (this.props.onUnset != null) {
            this.props.onUnset();
        }
    }

    render() {
        const {postingId, commentId, ownerName, ownerFullName, heading, unset, popperEnabled} = this.props;

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
                                <span className="heading" dangerouslySetInnerHTML={{__html: heading}}/>
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

export default connect(
    state => ({
        popperEnabled: getSetting(state, "comment.replied-to.glance.enabled") && !Browser.isTouchScreen()
    }),
    { glanceComment }
)(RepliedTo);
