import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./PostingPin.css";

const PostingPin = ({posting}) => (
    posting.pinned ?
        <div className="pin-line">
            <span className="badge badge-secondary">
                <FontAwesomeIcon icon="thumbtack" size="sm"/>
                {" "}Pinned post
            </span>
        </div>
    : null
);

export default PostingPin;
