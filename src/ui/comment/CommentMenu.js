import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { commentCopyLink, commentDelete, openCommentDialog } from "state/detailedposting/actions";
import { openSourceDialog } from "state/sourcedialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { getCommentsReceiverName, getCommentsReceiverPostingId } from "state/detailedposting/selectors";

class CommentMenu extends React.PureComponent {

    onCopyLink = () => {
        const {postingId, comment, commentCopyLink} = this.props;

        commentCopyLink(comment.id, postingId);
    };

    onEdit = () => {
        const {comment, openCommentDialog} = this.props;

        openCommentDialog(comment.id);
    };

    onDelete = () => {
        const {comment, confirmBox} = this.props;

        confirmBox(`Do you really want to delete the comment "${comment.heading}"?`, "Delete", "Cancel",
            commentDelete(comment.id), null, "danger");
    };

    onViewSource = () => {
        const {receiverName, receiverPostingId, comment, openSourceDialog} = this.props;

        openSourceDialog(receiverName, receiverPostingId, comment.id);
    };

    render() {
        const {postingId, comment, isPermitted, rootLocation} = this.props;

        return (
            <DropdownMenu items={[
                {
                    title: "Copy link",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onCopyLink,
                    show: true
                },
                {
                    title: "Edit...",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onEdit,
                    show: isPermitted("edit", comment),
                },
                {
                    divider: true
                },
                {
                    title: "View source",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onViewSource,
                    show: true
                },
                {
                    title: "Delete",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onDelete,
                    show: isPermitted("delete", comment) // FIXME all permissions work?
                }
            ]}/>
        );
    }

}

export default connect(
    state => ({
        rootLocation: getNodeRootLocation(state),
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state)
    }),
    { commentCopyLink, openCommentDialog, openSourceDialog, confirmBox }
)(CommentMenu);
