import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { confirmBox } from "state/confirmbox/actions";
import {
    postingCommentAddedBlock,
    postingCommentAddedUnblock,
    postingCommentsSubscribe,
    postingCommentsUnsubscribe,
    postingCopyLink,
    postingDelete
} from "state/postings/actions";
import { postingReply } from "state/postingreply/actions";
import { storyPinningUpdate } from "state/stories/actions";
import { openChangeDateDialog } from "state/changedatedialog/actions";
import { openSourceDialog } from "state/sourcedialog/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { entryCopyText } from "state/entrycopytextdialog/actions";
import { getHomeOwnerName } from "state/home/selectors";
import { getOwnerName, isPermitted } from "state/node/selectors";
import {
    getPostingCommentAddedInstantBlockId,
    getPostingCommentsSubscriptionId,
    isPostingSheriff,
    isPostingSheriffProhibited
} from "state/postings/selectors";
import { commentsShowInvisibleSet } from "state/detailedposting/actions";
import { hasInvisibleComments, isCommentsShowInvisible } from "state/detailedposting/selectors";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { MinimalStoryInfo } from "ui/types";
import { DropdownMenu, DropdownMenuItems } from "ui/control";
import * as Browser from "ui/browser";
import "ui/entry/EntryMenu.css";

interface Props {
    posting: PostingInfo;
    story: MinimalStoryInfo;
    detailed?: boolean;
}

function PostingMenuItems({posting, story, detailed}: Props) {
    const nodeOwnerName = useSelector(getOwnerName);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const commentsSubscriptionId = useSelector((state: ClientState) =>
        getPostingCommentsSubscriptionId(state, posting.id));
    const commentAddedInstantBlockId = useSelector((state: ClientState) =>
        getPostingCommentAddedInstantBlockId(state, posting.id));
    const containsInvisibleComments = useSelector((state: ClientState) =>
        (detailed ?? false) && hasInvisibleComments(state));
    const showInvisibleComments = useSelector((state: ClientState) =>
        (detailed ?? false) && isCommentsShowInvisible(state));
    const postingEditable = useSelector((state: ClientState) => isPermitted("edit", posting, "owner", state));
    const postingDeletable = useSelector((state: ClientState) => isPermitted("delete", posting, "private", state));
    const storyEditable = useSelector((state: ClientState) => isPermitted("edit", story, "admin", state));
    const googlePlayGoverned = isPostingSheriff(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlaySheriff = useSelector((state: ClientState) =>
        getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlayProhibited = isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCopyLink = () => dispatch(postingCopyLink(posting.id, ""));

    const onCopyText = () =>
        dispatch(entryCopyText(posting.body, "ask", posting.receiverName ?? "", posting.media ?? null));

    const onShare = () => {
        const originalDeleted = posting.receiverDeletedAt != null;
        const nodeName = originalDeleted ? (nodeOwnerName ?? "") : (posting.receiverName ?? posting.ownerName);
        const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);
        const href = `/post/${postingId}`;

        dispatch(shareDialogPrepare(nodeName, href));
    };

    const onReply = () => dispatch(postingReply(posting.id));

    const ownPosting = (posting.receiverName ?? posting.ownerName) === homeOwnerName;
    const followingComments = ownPosting ? commentAddedInstantBlockId == null : commentsSubscriptionId != null;

    const onFollowComments = () => {
        if (ownPosting) {
            dispatch(postingCommentAddedUnblock(posting.id, ""));
        } else {
            dispatch(postingCommentsSubscribe(posting.id, ""));
        }
    }

    const onUnfollowComments = () => {
        if (ownPosting) {
            dispatch(postingCommentAddedBlock(posting.id, ""));
        } else {
            dispatch(postingCommentsUnsubscribe(posting.id, ""));
        }
    }

    const onDelete = () => {
        dispatch(confirmBox(t("delete-post", {heading: posting.heading}), t("delete"), t("cancel"),
            postingDelete(posting.id, ""), null, "danger"));
    };

    const onPin = () => dispatch(storyPinningUpdate(story.id, !story.pinned));

    const onChangeDate = () => dispatch(openChangeDateDialog(story.id, story.publishedAt));

    const onViewSource = () => {
        if (posting.receiverName == null) {
            dispatch(openSourceDialog("", posting.id));
        } else {
            if (posting.receiverPostingId != null) {
                dispatch(openSourceDialog(posting.receiverName, posting.receiverPostingId));
            }
        }
    };

    const onShowInvisibleComments = () => dispatch(commentsShowInvisibleSet(true));

    const onHideInvisibleComments = () => dispatch(commentsShowInvisibleSet(false));

    const ownerName = posting.receiverName ?? posting.ownerName;
    const fullName = (posting.receiverName != null ? posting.receiverFullName : posting.ownerFullName) ?? null;
    const gender = (posting.receiverName != null ? posting.receiverGender : posting.ownerGender) ?? null;
    const postingId = posting.receiverPostingId ?? posting.id;

    const onHideInGooglePlay = () =>
        dispatch(openSheriffOrderDialog({
            nodeName: ownerName,
            fullName,
            feedName: "timeline",
            postingOwnerName: ownerName,
            postingOwnerFullName: fullName,
            postingOwnerGender: gender,
            postingId,
            postingHeading: posting.heading
        }));

    const onUnhideInGooglePlay = () => {
        dispatch(confirmBox(t("unhide-post-google-play", {heading: posting.heading}), t("unhide"), t("cancel"),
            sheriffOrderDelete({nodeName: ownerName, feedName: "timeline", postingId}), null, "success"));
    };

    const postingHref = `/post/${posting.id}`;
    return (
        <DropdownMenuItems items={[
            {
                title: t("copy-link"),
                nodeName: "",
                href: postingHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                nodeName: "",
                href: postingHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share-ellipsis"),
                nodeName: "",
                href: postingHref,
                onClick: onShare,
                show: true
            },
            {
                title: t("reply-ellipsis"),
                nodeName: ":",
                href: "/compose",
                onClick: onReply,
                show: true
            },
            {
                title: t("follow-comments"),
                nodeName: "",
                href: postingHref,
                onClick: onFollowComments,
                show: !followingComments
            },
            {
                title: t("unfollow-comments"),
                nodeName: "",
                href: postingHref,
                onClick: onUnfollowComments,
                show: followingComments
            },
            {
                divider: true
            },
            {
                title: t("edit-ellipsis"),
                nodeName: ":",
                href: `/compose?id=${postingId}`,
                show: postingEditable
            },
            {
                title: story != null && !story.pinned ? t("pin") : t("unpin"),
                nodeName: "",
                href: postingHref,
                onClick: onPin,
                show: story != null && storyEditable
            },
            {
                title: t("change-date-time-ellipsis"),
                nodeName: "",
                href: postingHref,
                onClick: onChangeDate,
                show: posting.receiverName == null && storyEditable
            },
            {
                divider: true
            },
            {
                title: t("view-source"),
                nodeName: "",
                href: postingHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                nodeName: "",
                href: postingHref,
                onClick: onDelete,
                show: postingDeletable
            },
            {
                divider: true
            },
            {
                title: t("show-hidden-comments"),
                nodeName: "",
                href: postingHref,
                onClick: onShowInvisibleComments,
                show: containsInvisibleComments && !showInvisibleComments
            },
            {
                title: t("hide-hidden-comments"),
                nodeName: "",
                href: postingHref,
                onClick: onHideInvisibleComments,
                show: containsInvisibleComments && showInvisibleComments
            },
            {
                divider: true
            },
            {
                title: t("hide-in-google-play"),
                nodeName: "",
                href: postingHref,
                onClick: onHideInGooglePlay,
                show: googlePlaySheriff && googlePlayGoverned && !googlePlayProhibited
            },
            {
                title: t("unhide-in-google-play"),
                nodeName: "",
                href: postingHref,
                onClick: onUnhideInGooglePlay,
                show: googlePlaySheriff && googlePlayGoverned && googlePlayProhibited
            },
            {
                title: t("report-sheriff-ellipsis"),
                nodeName: "",
                href: postingHref,
                onClick: onHideInGooglePlay,
                show: Browser.isAndroidGooglePlay() && !googlePlaySheriff
            }
        ]}/>
    );
}

const PostingMenu = ({posting, story, detailed}: Props) =>
    <DropdownMenu content={
        <PostingMenuItems posting={posting} story={story} detailed={detailed}/>
    }/>;

export default PostingMenu;
