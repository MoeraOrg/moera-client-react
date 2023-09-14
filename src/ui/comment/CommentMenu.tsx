import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { CommentInfo, PrincipalValue } from "api";
import { ClientState } from "state/state";
import { isPermitted, IsPermittedOptions, IsPrincipalEqualsOptions, isPrincipalIn } from "state/node/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { entryCopyText } from "state/entrycopytextdialog/actions";
import { commentCopyLink, commentDelete, commentSetVisibility, openCommentDialog } from "state/detailedposting/actions";
import {
    getCommentsBlockedUsers,
    getCommentsReceiverFeatures,
    getCommentsReceiverFullName,
    getCommentsReceiverName,
    getCommentsReceiverPostingId,
    getDetailedPosting,
    isCommentSheriffProhibited
} from "state/detailedposting/selectors";
import { isPostingSheriff, isPostingSheriffProhibited } from "state/postings/selectors";
import { openSourceDialog } from "state/sourcedialog/actions";
import { confirmBox } from "state/confirmbox/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { openBlockDialog } from "state/blockdialog/actions";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { DropdownMenu } from "ui/control";
import { Browser } from "ui/browser";

interface OwnProps {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function CommentMenu({
    nodeName, postingId, comment, homeOwnerName, receiverName, receiverFullName, receiverPostingId, posting,
    blockedUsers, isPostingPermitted, isCommentPermitted, isCommentPrincipalIn, googlePlayGoverned, googlePlaySheriff,
    googlePlayPostingProhibited, googlePlayProhibited, commentCopyLink, openCommentDialog, openSourceDialog, confirmBox,
    shareDialogPrepare, entryCopyText, commentSetVisibility, openBlockDialog, openSheriffOrderDialog
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

    const onHideInGooglePlay = () => {
        if (receiverName != null && receiverPostingId != null && posting != null) {
            const postingOwnerName = posting.receiverName ?? posting.ownerName;
            const postingOwnerFullName = posting.receiverName != null ? posting.receiverFullName : posting.ownerFullName;
            const postingOwnerGender = posting.receiverName != null ? posting.receiverGender : posting.ownerGender;

            openSheriffOrderDialog({
                nodeName: receiverName,
                fullName: receiverFullName,
                feedName: "timeline",
                postingOwnerName,
                postingOwnerFullName,
                postingOwnerGender,
                postingId: receiverPostingId,
                postingHeading: posting.heading,
                commentId: comment.id,
                commentHeading: comment.heading
            });
        }
    }

    const onUnhideInGooglePlay = () => {
        if (receiverName != null && receiverPostingId != null) {
            confirmBox(t("unhide-comment-google-play", {heading: comment.heading}), t("unhide"), t("cancel"),
                sheriffOrderDelete({
                    nodeName: receiverName,
                    feedName: "timeline",
                    postingId: receiverPostingId,
                    commentId: comment.id
                }), null, "success");
        }
    };

    const commentHref = `/post/${postingId}?comment=${comment.id}`;
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
                nodeName: "",
                href: commentHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                nodeName: "",
                href: commentHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share-ellipsis"),
                nodeName: "",
                href: commentHref,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: t("edit-ellipsis"),
                nodeName: "",
                href: commentHref,
                onClick: onEdit,
                show: isCommentPermitted("edit", "owner", {}),
            },
            {
                title: t("view-source"),
                nodeName: "",
                href: commentHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                nodeName: "",
                href: commentHref,
                onClick: onDelete,
                show: isCommentPermitted("delete", "private", {})
            },
            {
                divider: true
            },
            {
                title: t("hide"),
                nodeName: "",
                href: commentHref,
                onClick: onHide,
                show: hideable
            },
            {
                title: t("unhide"),
                nodeName: "",
                href: commentHref,
                onClick: onShow,
                show: !hideable && unhideable
            },
            {
                title: t("kick-ellipsis"),
                nodeName: "",
                href: commentHref,
                onClick: onBlockDialog,
                show: comment.ownerName !== homeOwnerName
            },
            {
                divider: true
            },
            {
                title: t("hide-in-google-play"),
                nodeName: "",
                href: commentHref,
                onClick: onHideInGooglePlay,
                show: googlePlaySheriff && googlePlayGoverned && !googlePlayPostingProhibited && !googlePlayProhibited
            },
            {
                title: t("unhide-in-google-play"),
                nodeName: "",
                href: commentHref,
                onClick: onUnhideInGooglePlay,
                show: googlePlaySheriff && googlePlayGoverned && !googlePlayPostingProhibited && googlePlayProhibited
            },
            {
                title: t("report-sheriff-ellipsis"),
                nodeName: "",
                href: commentHref,
                onClick: onHideInGooglePlay,
                show: Browser.isAndroidGooglePlay() && !googlePlaySheriff
            }
        ]}/>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        homeOwnerName: getHomeOwnerName(state),
        receiverName: getCommentsReceiverName(state),
        receiverFullName: getCommentsReceiverFullName(state),
        receiverPostingId: getCommentsReceiverPostingId(state),
        posting: getDetailedPosting(state),
        blockedUsers: getCommentsBlockedUsers(state),
        isPostingPermitted: (operation: string, defaultValue: PrincipalValue, options: Partial<IsPermittedOptions>) =>
            isPermitted(operation, getDetailedPosting(state), defaultValue, state, options),
        isCommentPermitted: (operation: string, defaultValue: PrincipalValue, options: Partial<IsPermittedOptions>) =>
            isPermitted(operation, ownProps.comment, defaultValue, state, {
                ...options,
                objectSourceName: getCommentsReceiverName(state),
                objectSourceFeatures: getCommentsReceiverFeatures(state)
            }),
        isCommentPrincipalIn: (operation: string, defaultValue: PrincipalValue,
                               value: PrincipalValue | PrincipalValue[], options: Partial<IsPrincipalEqualsOptions>) =>
            isPrincipalIn(operation, ownProps.comment, defaultValue, value, options),
        googlePlayGoverned: isPostingSheriff(getDetailedPosting(state), SHERIFF_GOOGLE_PLAY_TIMELINE),
        googlePlaySheriff: getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE,
        googlePlayPostingProhibited: isPostingSheriffProhibited(
            getDetailedPosting(state), SHERIFF_GOOGLE_PLAY_TIMELINE),
        googlePlayProhibited: isCommentSheriffProhibited(
            getDetailedPosting(state), ownProps.comment, SHERIFF_GOOGLE_PLAY_TIMELINE)
    }),
    {
        commentCopyLink, openCommentDialog, openSourceDialog, confirmBox, shareDialogPrepare, entryCopyText,
        commentSetVisibility, openBlockDialog, openSheriffOrderDialog
    }
);

export default connector(CommentMenu);
