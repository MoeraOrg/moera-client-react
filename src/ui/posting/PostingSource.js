import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Jump from "ui/navigation/Jump";
import { DelayedPopper, Manager, Reference } from "ui/control/DelayedPopper";
import PostingSources from "ui/posting/PostingSources";
import "./PostingSource.css";

const PostingSource = ({posting}) => (
    posting.receiverName != null ?
        <Manager>
            <Reference>
                {(ref, mainEnter, mainLeave, mainTouch) =>
                    <Jump className="posting-source" nodeName={posting.receiverName}
                          href={`/post/${posting.receiverPostingId}`} anchorRef={ref} onMouseEnter={mainEnter}
                          onMouseLeave={mainLeave} onTouchStart={mainTouch}>
                        <FontAwesomeIcon icon="retweet"/>
                    </Jump>
                }
            </Reference>
            <DelayedPopper placement="bottom-start" arrow={true}>
                <PostingSources posting={posting}/>
            </DelayedPopper>
        </Manager>
    :
        null
);

export default PostingSource;
