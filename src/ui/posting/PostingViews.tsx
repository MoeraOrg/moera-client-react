import React from 'react';

import { PostingInfo } from "api";
import { Icon, msVisibility } from "ui/material-symbols";
import "./PostingViews.css";

interface Props {
    posting: Pick<PostingInfo, "viewCount" | "receiverName" | "receiverPostingId">;
}

export default function PostingViews({posting}: Props) {
    const {viewCount, receiverName, receiverPostingId} = posting;

    if (receiverName != null || receiverPostingId != null || viewCount == null || viewCount <= 0) {
        return null;
    }

    return (
        <div className="posting-views">
            <Icon icon={msVisibility} size="1.2em"/>
            <span className="caption">{viewCount}</span>
        </div>
    );
}
