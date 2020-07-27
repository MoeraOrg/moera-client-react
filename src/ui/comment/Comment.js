import React from 'react';
import { connect } from 'react-redux';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import EntryHtml from "ui/posting/EntryHtml";
import CommentMenu from "ui/comment/CommentMenu";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
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
        <CommentMenu comment={comment} isPermitted={isPermitted}/>
        <div className="owner-line">
            <CommentOwner comment={comment}/>
            <CommentDate comment={comment}/>
            <CommentUpdated comment={comment}/>
        </div>
        <Content className="content" comment={comment}/>
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, comment) => isPermitted(operation, comment, state)
    })
)(Comment);
