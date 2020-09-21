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
import CommentReactions from "ui/comment/CommentReactions";
import CommentRepliedTo from "ui/comment/CommentRepliedTo";
import { getCommentsState } from "state/detailedposting/selectors";
import "./Comment.css";

class Content extends React.PureComponent {

    state = {
        preview: true
    };

    onClick = () => {
        this.setState({preview: !this.state.preview});
    }

    render() {
        const {comment} = this.props;

        return (
            <div className="content" onClick={this.onClick}>
                <CommentRepliedTo comment={comment}/>
                {this.renderText()}
            </div>
        );
    }

    renderText() {
        const {comment} = this.props;

        if (this.state.preview) {
            if (comment.bodyPreview.text) {
                return (
                    <>
                        <EntryHtml html={comment.bodyPreview.text}/>
                        <p>
                            <button className="btn btn-link pl-0 pt-0" onClick={this.onClick}>Read more...</button>
                        </p>
                    </>
                );
            } else {
                return <EntryHtml html={comment.body.previewText}/>;
            }
        } else {
            return <EntryHtml html={comment.body.text}/>;
        }
    }

}

const Comment = ({postingId, comment, focused, connectedToHome, postingReceiverName, isPermitted}) => (
    <div className={cx("comment", "entry", {
        "focused": focused,
        "single-emoji": comment.singleEmoji,
        "topic-starter": comment.ownerName === postingReceiverName
    })} data-moment={comment.moment}>
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
                <div className="reactions-line">
                    {connectedToHome && <CommentButtons comment={comment}/>}
                    <CommentReactions postingId={postingId} comment={comment}/>
                </div>
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        postingReceiverName: getCommentsState(state).receiverName,
        isPermitted: (operation, comment) =>
            isPermitted(operation, comment, state, getCommentsState(state).receiverName)
    })
)(Comment);
