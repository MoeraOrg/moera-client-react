import React from 'react';

import CommentsSentinel from "ui/comment/CommentsSentinel";
import "./CommentsSentinelLine.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
}

const CommentsSentinelLine = ({visible, loading, title, total, onClick}: Props) => (
    <div className="comments-sentinel-line">
        <CommentsSentinel loading={loading} title={title} total={total} visible={visible} onClick={onClick}/>
    </div>
);

export default CommentsSentinelLine;
