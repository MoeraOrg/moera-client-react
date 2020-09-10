import React from 'react';
import PropType from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "ui/control";
import Jump from "ui/navigation/Jump";
import "./RepliedTo.css";

export default class RepliedTo extends React.PureComponent {

    static propTypes = {
        postingId: PropType.string,
        commentId: PropType.string,
        ownerName: PropType.string,
        heading: PropType.string,
        unset: PropType.bool,
        onUnset: PropType.func
    };

    onUnset = () => {
        this.props.onUnset();
    }

    render() {
        const {postingId, commentId, ownerName, heading, unset} = this.props;

        if (commentId == null) {
            return null;
        }

        return (
            <div className="replied-to">
                <Jump href={`/post/${postingId}?comment=${commentId}`}>
                    <span className="icon"><FontAwesomeIcon icon="reply"/></span>
                    <NodeName name={ownerName} linked={false}/>
                    <span className="heading">{heading}</span>
                </Jump>
                {unset && <button className="unset" onClick={this.onUnset}>&times;</button>}
            </div>
        );
    }

}
