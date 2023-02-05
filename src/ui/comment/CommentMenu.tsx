import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
    getCommentsBlockedUsers,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getDetailedPosting
} from "state/detailedposting/selectors";
import { openSourceDialog } from "state/sourcedialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { DropdownMenu } from "ui/control";
import { openBlockDialog } from "state/blockdialog/actions";
import { getHomeOwnerName } from "state/home/selectors";

interface OwnProps {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function CommentMenu({
    nodeName, postingId, comment, rootLocation, homeOwnerName, receiverName, receiverPostingId, blockedUsers,
    isPostingPermitted, isCommentPermitted, isCommentPrincipalIn, commentCopyLink, openCommentDialog, openSourceDialog,
    confirmBox, shareDialogPrepare, entryCopyText, commentSetVisibility, openBlockDialog
}: Props) {
    const {t} = useTranslation();

    const onCopyLink = () => commentCopyLink(comment.id, postingId);

    const onCopyText = () => entryCopyText(comment.body, "ask", receiverName ?? "", comment.media ?? null);

    const onShare = () => {
        const href = `/post/${postingId}?comment=${comment.id}`;
        shareDialogPrepare(nodeName, href);
    };

    const onEdit = () => openCommentDialog(comment.id);

    const onDelete = () => {
        confirmBox(t("delete-comment", {heading: comment.heading}), t("delete"), t("cancel"),
            commentDelete(comment.id), null, "danger");
    };

    const onViewSource = () => {
        if (receiverName != null && receiverPostingId != null) {
            openSourceDialog(receiverName, receiverPostingId, comment.id);
        }
    };

    const onHide = () => commentSetVisibility(comment.id, false);

    const onShow = () => commentSetVisibility(comment.id, true);

    const onBlockDialog = () => {
        if (receiverName != null && receiverPostingId != null) {
            openBlockDialog(
                comment.ownerName, comment.ownerFullName ?? null, receiverName, receiverPostingId, blockedUsers
            );
        }
    }

    const commentHref = `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`;
    const hideable = (isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "public", "public", {useOperations: "owner"}))
        || (isPostingPermitted("overrideComment", "owner", {}) && !isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "unset", ["unset", "public"], {useOperations: "senior"}));
    const unhideable = (isCommentPermitted("edit", "owner", {})
            && isCommentPrincipalIn("view", "public", "private", {useOperations: "owner"}))
        || (isPostingPermitted("overrideComment", "owner", {})
            && isCommentPrincipalIn("view", "unset", "private", {useOperations: "senior"}));
    return (
        <DropdownMenu items={[
            {
                title: t("copy-link"),
                href: commentHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                href: commentHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share-ellipsis"),
                href: commentHref,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: t("edit-ellipsis"),
                href: commentHref,
                onClick: onEdit,
                show: isCommentPermitted("edit", "owner", {}),
            },
            {
                title: t("view-source"),
                href: commentHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                href: commentHref,
                onClick: onDelete,
                show: isCommentPermitted("delete", "private", {})
            },
            {
                divider: true
            },
            {
                title: t("hide"),
                href: commentHref,
                onClick: onHide,
                show: hideable
            },
            {
                title: t("unhide"),
                href: commentHref,
                onClick: onShow,
                show: !hideable && unhideable
            },
            {
                title: t("kick-ellipsis"),
                href: commentHref,
                onClick: onBlockDialog,
                show: comment.ownerName !== homeOwnerName
            }
        ]}/>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        rootLocation: getNodeRootLocation(state),
        homeOwnerName: getHomeOwnerName(state),
        receiverName: getCommentsReceiverName(state),
        receiverPostingId: getCommentsReceiverPostingId(state),
        blockedUsers: getCommentsBlockedUsers(state),
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
        commentSetVisibility, openBlockDialog
    }
);

export default connector(CommentMenu);
