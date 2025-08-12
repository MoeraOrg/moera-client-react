import React from 'react';

import CommentsSentinel from "ui/comment/CommentsSentinel";
import "./CommentsSentinelLine.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onClick: () => void;
    end: boolean;
}

const CommentsSentinelLine = ({visible, loading, title, total, onClick, end}: Props) => (
    <div className="comments-sentinel-line">
        <CommentsSentinel loading={loading} title={title} total={total} visible={visible} onClick={onClick}/>
        {/*<div className="comments-counter">*/}
        {/*    <CommentsRewindButton end={end} forward={false}/>*/}
        {/*    <CommentsLoadAllButton/>*/}
        {/*    <CommentsRewindButton end={end} forward={true}/>*/}
        {/*    <CommentsLeapButton end={end}/>*/}
        {/*</div>*/}
    </div>
);

export default CommentsSentinelLine;
