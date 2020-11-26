import React from 'react';
import PropType from 'prop-types';

import CommentsSentinel from "ui/comment/CommentsSentinel";
import CommentsRewindButton from "ui/comment/CommentsRewindButton";
import CommentsLoadAllButton from "ui/comment/CommentsLoadAllButton";
import CommentsLeapButton from "ui/comment/CommentsLeapButton";
import "./CommentsSentinelLine.css";

const CommentsSentinelLine = ({visible, loading, title, total, onBoundary, onClick, end}) => (
    <div className="comments-sentinel-line">
        <CommentsSentinel loading={loading} title={title} total={total} visible={visible} onBoundary={onBoundary}
                          onClick={onClick}/>
        <div className="comments-counter">
            <CommentsRewindButton end={end} forward={false}/>
            <CommentsLoadAllButton/>
            <CommentsRewindButton end={end} forward={true}/>
            <CommentsLeapButton end={end}/>
        </div>
    </div>
);

CommentsSentinelLine.propTypes = {
    visible: PropType.bool,
    loading: PropType.bool,
    title: PropType.string,
    total: PropType.number,
    onBoundary: PropType.func,
    onClick: PropType.func,
    end: PropType.bool
}

export default CommentsSentinelLine;
