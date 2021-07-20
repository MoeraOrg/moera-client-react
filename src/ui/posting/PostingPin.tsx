import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./PostingPin.css";

interface Props {
    pinned?: boolean | null;
}

const PostingPin = ({pinned}: Props) => (
    pinned ?
        <div className="pin-line">
            <span className="badge badge-secondary">
                <FontAwesomeIcon icon="thumbtack" size="sm"/>
                {" "}Pinned post
            </span>
        </div>
    : null
);

export default PostingPin;
