import React from 'react';
import { connect } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import EntryHtml from "ui/posting/EntryHtml";
import "./Comment.css";

const Content = ({comment}) => {
    if (comment.bodyPreview.text) {
        return (
            <div className="content">
                <EntryHtml html={comment.bodyPreview.text}/>
                <p><a href="#">View more...</a></p>
            </div>
        );
    } else {
        return (
            <EntryHtml className="content" html={comment.body.previewText}/>
        );
    }
};

const Comment = ({comment, deleting, isPermitted, connectedToHome}) => (
    <div className="comment entry" data-moment={comment.moment}>
        <Content className="content" comment={comment}/>
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, comment) => isPermitted(operation, comment, state)
    })
)(Comment);
