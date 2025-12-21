import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { CommentInfo } from "api";
import { ClientState } from "state/state";
import { isPermitted, IsPermittedOptions, isPrincipalIn } from "state/node/selectors";
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
import { DropdownMenu, DropdownMenuItems } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";
import { ut } from "util/url";

interface Props {
    nodeName: string;
    postingId: string;
    comment: CommentInfo;
}

function CommentMenuItems({nodeName, postingId, comment}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const receiverName = useSelector(getCommentsReceiverName);
    const receiverFeatures = useSelector(getCommentsReceiverFeatures);
    const receiverFullName = useSelector(getCommentsReceiverFullName);
    const receiverPostingId = useSelector(getCommentsReceiverPostingId);
    const posting = useSelector(getDetailedPosting);
    const blockedUsers = useSelector(getCommentsBlockedUsers);
    const commentOverridable = useSelector((state: ClientState) =>
        isPermitted("overrideComment", posting, "owner", state)
    );

    const options: Partial<IsPermittedOptions> = {
        objectSourceName: receiverName,
        objectSourceFeatures: receiverFeatures
    };
    const commentEditable = useSelector((state: ClientState) => isPermitted("edit", comment, "owner", state, options));
    const commentDeletable = useSelector((state: ClientState) =>
        isPermitted("delete", comment, "private", state, options)
    );

    const dispatch = useDispatch();
    const {t} = useTranslation();

    const googlePlayGoverned = isPostingSheriff(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlaySheriff = homeOwnerName === SHERIFF_GOOGLE_PLAY_TIMELINE;
    const googlePlayPostingProhibited = isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlayProhibited = isCommentSheriffProhibited(posting, comment, SHERIFF_GOOGLE_PLAY_TIMELINE);

    const onCopyLink = () => dispatch(commentCopyLink(comment.id, postingId));

    const onCopyText = () =>
        dispatch(entryCopyText(comment.body, "ask", receiverName ?? REL_CURRENT, comment.media ?? null));

    const onShare = () => {
        const href = ut`/post/${postingId}?comment=${comment.id}`;
        dispatch(shareDialogPrepare(nodeName, href));
    };

    const onEdit = () => dispatch(openCommentDialog(comment.id));

    const onDelete = () => {
        dispatch(confirmBox({
            message: t("delete-comment", {heading: comment.heading}),
            yes: t("delete"),
            no: t("cancel"),
            onYes: commentDelete(comment.id),
            variant: "danger"
        }));
    };

    const onViewSource = () => {
        if (receiverName != null && receiverPostingId != null) {
            dispatch(openSourceDialog(receiverName, receiverPostingId, comment.id));
        }
    };

    const onHide = () => dispatch(commentSetVisibility(comment.id, false));

    const onShow = () => dispatch(commentSetVisibility(comment.id, true));

    const onBlockDialog = () => {
        if (receiverName != null && receiverPostingId != null) {
            dispatch(openBlockDialog(
                comment.ownerName, comment.ownerFullName ?? null, receiverName, receiverPostingId, blockedUsers
            ));
        }
    }

    const onHideInGooglePlay = () => {
        if (receiverName != null && receiverPostingId != null && posting != null) {
            const postingOwnerName = posting.receiverName ?? posting.ownerName;
            const postingOwnerFullName = posting.receiverName != null ? posting.receiverFullName : posting.ownerFullName;
            const postingOwnerGender = posting.receiverName != null ? posting.receiverGender : posting.ownerGender;

            dispatch(openSheriffOrderDialog({
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
            }));
        }
    }

    const onUnhideInGooglePlay = () => {
        if (receiverName != null && receiverPostingId != null) {
            dispatch(confirmBox({
                message: t("unhide-comment-google-play", {heading: comment.heading}),
                yes: t("unhide"),
                no: t("cancel"),
                onYes: sheriffOrderDelete({
                    nodeName: receiverName,
                    feedName: "timeline",
                    postingId: receiverPostingId,
                    commentId: comment.id
                }),
                variant: "success"
            }));
        }
    };

    const commentHref = ut`/post/${postingId}?comment=${comment.id}`;
    const hideable =
        (commentEditable && isPrincipalIn("view", comment, "public", "public", {useOperations: "owner"}))
        || (
            commentOverridable && !commentEditable
            && isPrincipalIn("view", comment, "unset", ["unset", "public"], {useOperations: "senior"})
        );
    const unhideable =
        (
            commentEditable
            && isPrincipalIn("view", comment, "public", "private", {useOperations: "owner"})
        )
        || (commentOverridable && isPrincipalIn("view", comment, "unset", "private", {useOperations: "senior"}));
    return (
        <DropdownMenuItems items={[
            {
                title: t("copy-link"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onShare,
                show: true
            },
            {
                divider: true
            },
            {
                title: t("edit"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onEdit,
                show: commentEditable,
            },
            {
                title: t("view-source"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onDelete,
                show: commentDeletable
            },
            {
                divider: true
            },
            {
                title: t("hide"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onHide,
                show: hideable
            },
            {
                title: t("unhide"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onShow,
                show: !hideable && unhideable
            },
            {
                title: t("kick-discussion"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onBlockDialog,
                show: comment.ownerName !== homeOwnerName && receiverName === homeOwnerName
            },
            {
                divider: true
            },
            {
                title: t("hide-in-google-play"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onHideInGooglePlay,
                show: googlePlaySheriff
                    && ((!googlePlayPostingProhibited && !googlePlayProhibited) || !googlePlayGoverned)
            },
            {
                title: t("unhide-in-google-play"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onUnhideInGooglePlay,
                show: googlePlaySheriff
                    && ((!googlePlayPostingProhibited && googlePlayProhibited) || !googlePlayGoverned)
            },
            {
                title: t("report-sheriff"),
                nodeName: REL_CURRENT,
                href: commentHref,
                onClick: onHideInGooglePlay,
                show: homeOwnerName != null && !googlePlaySheriff && comment.ownerName !== homeOwnerName
            }
        ]}/>
    );
}

const CommentMenu = ({nodeName, postingId, comment}: Props) =>
    <DropdownMenu content={
        <CommentMenuItems nodeName={nodeName} postingId={postingId} comment={comment}/>
    }/>;

export default CommentMenu;
