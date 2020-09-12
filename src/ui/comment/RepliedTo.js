import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import Jump from "ui/navigation/Jump";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import GlanceComment from "ui/comment/GlanceComment";
import { glanceComment } from "state/detailedposting/actions";
import "./RepliedTo.css";
import { getSetting } from "state/settings/selectors";

class RepliedTo extends React.PureComponent {

    static propTypes = {
        postingId: PropType.string,
        commentId: PropType.string,
        ownerName: PropType.string,
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
        const {postingId, commentId, ownerName, heading, unset, popperEnabled} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <div className="replied-to">
                <Manager onPreparePopper={this.onPreparePopper} disabled={!popperEnabled}>
                    <Reference>
                        {(ref, mainEnter, mainLeave) =>
                            <span ref={ref} onMouseEnter={mainEnter} onMouseLeave={mainLeave}>
                                <Jump href={`/post/${postingId}?comment=${commentId}`}>
                                    <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                                    <NodeName name={ownerName} linked={false}/>
                                    <span className="heading">{heading}</span>
                                </Jump>
                            </span>
                        }
                    </Reference>
                    <DelayedPopper placement="top" arrow={true} className="glance-comment-popover">
                        <GlanceComment/>
                    </DelayedPopper>
                </Manager>
                {unset && <button className="unset" onClick={this.onUnset}>&times;</button>}
            </div>
        );
    }

}

export default connect(
    state => ({
        popperEnabled: getSetting(state, "comment.replied-to.glance.enabled")
    }),
    { glanceComment }
)(RepliedTo);
