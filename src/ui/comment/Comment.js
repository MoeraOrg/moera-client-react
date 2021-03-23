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
import { getCommentsReceiverPostingId, getCommentsState, getDetailedPosting } from "state/detailedposting/selectors";
import { hasWindowSelection } from "util/misc";
import "./Comment.css";

class Content extends React.PureComponent {

    state = {
        preview: true
    };

    onClick = () => {
        if (!hasWindowSelection()) {
            this.setState({preview: !this.state.preview});
        }
    }

    render() {
        const {comment} = this.props;
        const {preview} = this.state;

        return (
            <div className={cx("content", {"preview": preview})} onClick={this.onClick}>
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
                            <button className="btn btn-link read-more" onClick={this.onClick}>Read more...</button>
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

const Comment = ({
     postingId, comment, focused, connectedToHome, postingOwnerName, postingReceiverName, postingReceiverPostingId,
     isPermitted
}) => (
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
                    <CommentDate nodeName={postingReceiverName ?? postingOwnerName}
                                 postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                    <CommentUpdated comment={comment}/>
                </div>
                <Content className="content" comment={comment}/>
                <div className="reactions-line">
                    {connectedToHome && comment.signature != null &&
                        <CommentButtons nodeName={postingReceiverName ?? postingOwnerName}
                                        postingId={postingReceiverPostingId ?? postingId} comment={comment}/>
                    }
                    <CommentReactions postingId={postingId} comment={comment}/>
                </div>
            </>
        }
    </div>
);

export default connect(
    state => ({
        connectedToHome: isConnectedToHome(state),
        postingOwnerName: getDetailedPosting(state).ownerName,
        postingReceiverName: getCommentsState(state).receiverName,
        postingReceiverPostingId: getCommentsReceiverPostingId(state),
        isPermitted: (operation, comment) =>
            isPermitted(operation, comment, state, getCommentsState(state).receiverName)
    })
)(Comment);
