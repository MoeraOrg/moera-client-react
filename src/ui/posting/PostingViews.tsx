import React from 'react';

import { Icon, msVisibility } from "ui/material-symbols";
import "./PostingViews.css";

interface Props {
    viewCount: number | null | undefined;
}

export default function PostingViews({viewCount}: Props) {
    if (viewCount == null || viewCount <= 0) {
        return null;
    }

    return (
        <div className="posting-views">
            <Icon icon={msVisibility} size="1.2em"/>
            <span className="caption">{viewCount}</span>
        </div>
    );
}
