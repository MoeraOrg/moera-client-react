import React from 'react';

import { PostingInfo } from "api";
import { Icon, msRepeat } from "ui/material-symbols";
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
                        <Icon icon={msRepeat} size="1em"/>
                    </Jump>
                );
            }
        }>
            <PostingSources posting={posting}/>
        </DelayedPopover>
    );
}
