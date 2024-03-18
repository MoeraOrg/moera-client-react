import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';

import { PostingInfo } from "api";
import Jump from "ui/navigation/Jump";
import { DelayedPopover } from "ui/control";
import PostingSources from "ui/posting/PostingSources";
import "./PostingSource.css";

interface Props {
    posting: PostingInfo;
}

export default function PostingSource({posting}: Props) {
    if (posting.receiverName == null) {
        return null;
    }
    return (
        <DelayedPopover placement="bottom-start" arrow element={
            ref => {
                if (posting.receiverName == null) {
                    return null;
                }
                return (
                    <Jump ref={ref} className="posting-source" nodeName={posting.receiverName}
                          href={`/post/${posting.receiverPostingId}`}>
                        <FontAwesomeIcon icon={faRetweet}/>
                    </Jump>
                );
            }
        }>
            <PostingSources posting={posting}/>
        </DelayedPopover>
    );
}
