import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CommentInfo, PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import {
    getNodeRootLocation,
    isPermitted,
    IsPermittedOptions,
    isPrincipalIn,
    IsPrincipalEqualsOptions
} from "state/node/selectors";
import { entryCopyText } from "state/entrycopytextdialog/actions";
import { commentCopyLink, commentDelete, commentSetVisibility, openCommentDialog } from "state/detailedposting/actions";
import {
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getDetailedPosting
} from "state/detailedposting/selectors";
import { openSourceDialog } from "state/sourcedialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { DropdownMenu } from "ui/control";

interface OwnProps {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function CommentMenu({nodeName, postingId, comment, rootLocation, receiverName, receiverPostingId, isPostingPermitted,
                      isCommentPermitted, isCommentPrincipalIn, commentCopyLink, openCommentDialog,
                      openSourceDialog, confirmBox, shareDialogPrepare, entryCopyText, commentSetVisibility}: Props) {

    const onCopyLink = () => commentCopyLink(comment.id, postingId);

    const onCopyText = () => entryCopyText(comment.body, "ask", receiverName ?? "", comment.media ?? null);

    const onShare = () => {
        const href = `/post/${postingId}?comment=${comment.id}`;
        shareDialogPrepare(nodeName, href);
    };

    const onEdit = () => openCommentDialog(comment.id);

    const onDelete = () => {
        confirmBox(`Do you really want to delete the comment "${comment.heading}"?`, "Delete", "Cancel",
            commentDelete(comment.id), null, "danger");
    };

    const onViewSource = () => {
        if (receiverName != null && receiverPostingId != null) {
            openSourceDialog(receiverName, receiverPostingId, comment.id);
        }
    };

    const onHide = () => commentSetVisibility(comment.id, false);

    const onShow = () => commentSetVisibility(comment.id, true);

    const commentHref = `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`;
    const hideable = (isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "public", "public", {useOperations: "owner"}))
        || (isPostingPermitted("edit", "owner", {}) && !isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "unset", ["unset", "public"], {useOperations: "senior"}));
    const unhideable = (isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "public", "private", {useOperations: "owner"}))
        || (isPostingPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "unset", "private", {useOperations: "senior"}));
    return (
        <DropdownMenu items={[
            {
                title: "Copy link",
                href: commentHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: "Copy text",
                href: commentHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: "Share...",
                href: commentHref,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: "Edit...",
                href: commentHref,
                onClick: onEdit,
                show: isCommentPermitted("edit", "owner", {}),
            },
            {
                title: "View source",
                href: commentHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: "Delete",
                href: commentHref,
                onClick: onDelete,
                show: isCommentPermitted("delete", "private", {})
            },
            {
                divider: true
            },
            {
                title: "Hide",
                href: commentHref,
                onClick: onHide,
                show: hideable
            },
            {
                title: "Unhide",
                href: commentHref,
                onClick: onShow,
                show: !hideable && unhideable
            }
        ]}/>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        rootLocation: getNodeRootLocation(state),
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state),
        isPostingPermitted: (operation: string, defaultValue: PrincipalValue, options: Partial<IsPermittedOptions>) =>
            isPermitted(operation, getDetailedPosting(state), defaultValue, state, options),
        isCommentPermitted: (operation: string, defaultValue: PrincipalValue, options: Partial<IsPermittedOptions>) =>
            isPermitted(operation, ownProps.comment, defaultValue, state,
                {...options, objectSourceName: getCommentsReceiverName(state)}),
        isCommentPrincipalIn: (operation: string, defaultValue: PrincipalValue,
                               value: PrincipalValue | PrincipalValue[], options: Partial<IsPrincipalEqualsOptions>) =>
            isPrincipalIn(operation, ownProps.comment, defaultValue, value, options)
    }),
    {
        commentCopyLink, openCommentDialog, openSourceDialog, confirmBox, shareDialogPrepare, entryCopyText,
        commentSetVisibility
    }
);

export default connector(CommentMenu);
