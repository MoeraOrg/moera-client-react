import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { isConnectedToHome } from "state/home/selectors";
import { isPermitted } from "state/node/selectors";
import EntryHtml from "ui/posting/EntryHtml";
import CommentMenu from "ui/comment/CommentMenu";
import CommentOwner from "ui/comment/CommentOwner";
import CommentDate from "ui/comment/CommentDate";
import CommentUpdated from "ui/comment/CommentUpdated";
import CommentDeleting from "ui/comment/CommentDeleting";
import CommentButtons from "ui/comment/CommentButtons";
import { getCommentsState } from "state/detailedposting/selectors";
import "./Comment.css";

class Content extends React.PureComponent {


    constructor(props, context) {
        super(props, context);

        this.state = {preview: true};
    }

    onClick = () => {
        this.setState({preview: !this.state.preview});
    }

    render() {
        const {comment} = this.props;

        if (this.state.preview) {
            if (comment.bodyPreview.text) {
                return (
                    <div className="content" onClick={this.onClick}>
                        <EntryHtml html={comment.bodyPreview.text}/>
                        <p>
                            <button className="btn btn-link pl-0 pt-0" onClick={this.onClick}>View more...</button>
                        </p>
                    </div>
                );
            } else {
                return (
                    <div className="content" onClick={this.onClick}>
                        <EntryHtml html={comment.body.previewText}/>
                    </div>
                );
            }
        } else {
            return (
                <div className="content" onClick={this.onClick}>
                    <EntryHtml html={comment.body.text}/>
                </div>
            );
        }
    }

}

const Comment = ({postingId, comment, focused, isPermitted, connectedToHome}) => (
    <div className={cx("comment", "entry", {"focused": focused})} data-moment={comment.moment}>
        {comment.deleting ?
            <CommentDeleting/>
        :
            <>
                <CommentMenu comment={comment} postingId={postingId} isPermitted={isPermitted}/>
                <div className="owner-line">
                    <CommentOwner comment={comment}/>
                    <CommentDate postingId={postingId} comment={comment}/>
                    <CommentUpdated comment={comment}/>
                </div>
                <Content className="content" comment={comment}/>
                {connectedToHome && <CommentButtons comment={comment}/>}
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        isPermitted: (operation, comment) =>
            isPermitted(operation, comment, state, getCommentsState(state).receiverName)
    })
)(Comment);
