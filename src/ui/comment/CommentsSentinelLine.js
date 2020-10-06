import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import CommentsSentinel from "ui/comment/CommentsSentinel";
import { getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import CommentsRewindButton from "ui/comment/CommentsRewindButton";
import "./CommentsSentinelLine.css";

class CommentsSentinelLine extends React.PureComponent {

    static propTypes = {
        visible: PropType.bool,
        loading: PropType.bool,
        title: PropType.string,
        onBoundary: PropType.func,
        onClick: PropType.func,
        loadedCount: PropType.number,
        totalCount: PropType.number,
        end: PropType.bool
    };

    render() {
        const {loading, title, visible, onBoundary, onClick, loadedCount, totalCount, end} = this.props;

        return (
            <div className="comments-sentinel-line">
                <CommentsSentinel loading={loading} title={title} visible={visible} onBoundary={onBoundary}
                                  onClick={onClick}/>
                <div className="comments-counter">
                    <CommentsRewindButton end={end} forward={false}/>
                    {totalCount > 0 && loadedCount < totalCount &&
                        <span>{loadedCount} of {totalCount}</span>
                    }
                    <CommentsRewindButton end={end} forward={true}/>
                </div>
            </div>
        );
    }

}

export default connect(
    state => ({
        loadedCount: getCommentsState(state).comments.length,
        totalCount: getDetailedPosting(state).totalComments
    })
)(CommentsSentinelLine);
