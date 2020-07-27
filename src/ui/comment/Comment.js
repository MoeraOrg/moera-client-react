import React from 'react';
import { connect } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import PostingHtml from "ui/posting/PostingHtml";

const Content = ({comment}) => {
    if (comment.bodyPreview.text) {
        return (
            <div className="content">
                <PostingHtml html={comment.bodyPreview.text}/>
                <p><a href="#">View more...</a></p>
            </div>
        );
    } else {
        return (
            <PostingHtml className="content" html={comment.body.previewText}/>
        );
    }
};

const Comment = ({comment, deleting, isPermitted, connectedToHome}) => (
    <div className="comment" data-moment={comment.moment}>
        <Content comment={comment}/>
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, comment) => isPermitted(operation, comment, state)
    })
)(Comment);
