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
        const {postingId, commentId, ownerName, heading, unset} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <div className="replied-to">
                <Manager onPreparePopper={this.onPreparePopper}>
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
                    <DelayedPopper placement="top" arrow={true}>
                        <GlanceComment/>
                    </DelayedPopper>
                </Manager>
                {unset && <button className="unset" onClick={this.onUnset}>&times;</button>}
            </div>
        );
    }

}

export default connect(
    null,
    { glanceComment }
)(RepliedTo);
