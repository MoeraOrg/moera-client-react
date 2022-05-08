import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CommentInfo } from "api/node/api-types";
import { entryCopyText } from "state/entrycopytextdialog/actions";
import { commentCopyLink, commentDelete, openCommentDialog } from "state/detailedposting/actions";
import { openSourceDialog } from "state/sourcedialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { getNodeRootLocation } from "state/node/selectors";
import { getCommentsReceiverName, getCommentsReceiverPostingId } from "state/detailedposting/selectors";
import { ClientState } from "state/state";
import { DropdownMenu } from "ui/control";

type Props = {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
    isPermitted: (operation: string, object: CommentInfo) => boolean | null;
} & ConnectedProps<typeof connector>;

class CommentMenu extends React.PureComponent<Props> {

    onCopyLink = () => {
        const {postingId, comment, commentCopyLink} = this.props;

        commentCopyLink(comment.id, postingId);
    };

    onCopyText = () => {
        const {comment, entryCopyText, receiverName} = this.props;

        entryCopyText(comment.body, "ask", receiverName ?? "", comment.media ?? null);
    };

    onShare = () => {
        const {postingId, nodeName, comment, shareDialogPrepare} = this.props;

        const href = `/post/${postingId}?comment=${comment.id}`;
        shareDialogPrepare(nodeName, href);
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

        if (receiverName != null && receiverPostingId != null) {
            openSourceDialog(receiverName, receiverPostingId, comment.id);
        }
    };

    render() {
        const {postingId, comment, isPermitted, rootLocation} = this.props;

        const commentHref = `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`;
        return (
            <DropdownMenu items={[
                {
                    title: "Copy link",
                    href: commentHref,
                    onClick: this.onCopyLink,
                    show: true
                },
                {
                    title: "Copy text",
                    href: commentHref,
                    onClick: this.onCopyText,
                    show: true
                },
                {
                    title: "Share...",
                    href: commentHref,
                    onClick: this.onShare,
                    show: true
                },
                {
                    divider: true
                },
                {
                    title: "Edit...",
                    href: commentHref,
                    onClick: this.onEdit,
                    show: isPermitted("edit", comment) ?? false,
                },
                {
                    title: "View source",
                    href: commentHref,
                    onClick: this.onViewSource,
                    show: true
                },
                {
                    title: "Delete",
                    href: commentHref,
                    onClick: this.onDelete,
                    show: isPermitted("delete", comment) ?? false // FIXME all permissions work?
                }
            ]}/>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        rootLocation: getNodeRootLocation(state),
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state)
    }),
    { commentCopyLink, openCommentDialog, openSourceDialog, confirmBox, shareDialogPrepare, entryCopyText }
);

export default connector(CommentMenu);
