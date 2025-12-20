import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { NodeName, PostingInfo } from "api";
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
import { isPermitted } from "state/node/selectors";
import {
    getPostingCommentAddedInstantBlockId,
    getPostingCommentsSubscriptionId,
    isPostingSheriff,
    isPostingSheriffProhibited
} from "state/postings/selectors";
import { commentsShowInvisibleSet } from "state/detailedposting/actions";
import { hasInvisibleComments, isCommentsShowInvisible } from "state/detailedposting/selectors";
import { openSheriffOrderDialog, sheriffOrderDelete } from "state/sherifforderdialog/actions";
import { recommendationDont } from "state/feeds/actions";
import { MinimalStoryInfo } from "ui/types";
import { DropdownMenu, DropdownMenuItems } from "ui/control";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "ui/entry/EntryMenu.css";

interface Props {
    posting: PostingInfo;
    story: MinimalStoryInfo | null;
    detailed?: boolean;
}

function PostingMenuItems({posting, story, detailed}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const commentsSubscriptionId = useSelector((state: ClientState) =>
        getPostingCommentsSubscriptionId(state, posting.id, REL_CURRENT)
    );
    const commentAddedInstantBlockId = useSelector((state: ClientState) =>
        getPostingCommentAddedInstantBlockId(state, posting.id, REL_CURRENT)
    );
    const containsInvisibleComments = useSelector((state: ClientState) =>
        (detailed ?? false) && hasInvisibleComments(state)
    );
    const showInvisibleComments = useSelector((state: ClientState) =>
        (detailed ?? false) && isCommentsShowInvisible(state)
    );
    const postingEditable = useSelector((state: ClientState) => isPermitted("edit", posting, "owner", state));
    const postingDeletable = useSelector((state: ClientState) => isPermitted("delete", posting, "private", state));
    const storyEditable = useSelector((state: ClientState) =>
        story != null && isPermitted("edit", story, "admin", state)
    );
    const googlePlayGoverned = isPostingSheriff(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const googlePlaySheriff = useSelector((state: ClientState) =>
        getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE
    );
    const googlePlayProhibited = isPostingSheriffProhibited(posting, SHERIFF_GOOGLE_PLAY_TIMELINE);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCopyLink = () => dispatch(postingCopyLink(posting.id, REL_CURRENT));

    const onCopyText = () =>
        dispatch(entryCopyText(posting.body, "ask", posting.receiverName ?? REL_CURRENT, posting.media ?? null));

    const onShare = () => {
        const originalDeleted = posting.receiverDeletedAt != null;
        const nodeName = originalDeleted ? REL_CURRENT : (posting.receiverName ?? posting.ownerName);
        const postingId = originalDeleted ? posting.id : (posting.receiverPostingId ?? posting.id);
        const href = `/post/${postingId}`;

        dispatch(shareDialogPrepare(nodeName, href));
    };

    const onReply = () => dispatch(postingReply(posting.id));

    const ownerName = posting.receiverName ?? posting.ownerName;
    const fullName = (posting.receiverName != null ? posting.receiverFullName : posting.ownerFullName) ?? null;
    const gender = (posting.receiverName != null ? posting.receiverGender : posting.ownerGender) ?? null;
    const postingId = posting.receiverPostingId ?? posting.id;

    const ownPosting = ownerName === homeOwnerName;
    const followingComments = ownPosting ? commentAddedInstantBlockId == null : commentsSubscriptionId != null;

    const onFollowComments = () => {
        if (ownPosting) {
            dispatch(postingCommentAddedUnblock(posting.id, REL_CURRENT));
        } else {
            dispatch(postingCommentsSubscribe(posting.id, REL_CURRENT));
        }
    }

    const onUnfollowComments = () => {
        if (ownPosting) {
            dispatch(postingCommentAddedBlock(posting.id, REL_CURRENT));
        } else {
            dispatch(postingCommentsUnsubscribe(posting.id, REL_CURRENT));
        }
    }

    const onDelete = () => {
        dispatch(confirmBox({
            message: t("delete-post", {heading: posting.heading}),
            yes: t("delete"),
            no: t("cancel"),
            onYes: postingDelete(posting.id, REL_CURRENT),
            variant: "danger"
        }));
    };

    const onPin = () => story != null && dispatch(storyPinningUpdate(story.id, !story.pinned));

    const onChangeDate = () => story != null && dispatch(openChangeDateDialog(story.id, story.publishedAt));

    const onDontRecommend = () => {
        dispatch(confirmBox({
            message: t(
                "dont-recommend-user",
                {name: posting.receiverFullName || NodeName.shorten(posting.receiverName)}
            ),
            yes: t("dont-recommend"),
            no: t("cancel"),
            onYes: deleteAll => posting.receiverName ? recommendationDont(posting.receiverName, deleteAll) : null,
            variant: "danger",
            dontShowAgain: t("delete-all-his-recommended", {gender: posting.receiverGender}),
            dontShowAgainBox: true
        }));
    }

    const onViewSource = () => {
        if (posting.receiverName == null) {
            dispatch(openSourceDialog(REL_CURRENT, posting.id));
        } else {
            if (posting.receiverPostingId != null) {
                dispatch(openSourceDialog(posting.receiverName, posting.receiverPostingId));
            }
        }
    };

    const onShowInvisibleComments = () => dispatch(commentsShowInvisibleSet(true));

    const onHideInvisibleComments = () => dispatch(commentsShowInvisibleSet(false));

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
        dispatch(confirmBox({
            message: t("unhide-post-google-play", {heading: posting.heading}),
            yes: t("unhide"),
            no: t("cancel"),
            onYes: sheriffOrderDelete({nodeName: ownerName, feedName: "timeline", postingId}),
            variant: "success"
        }));
    };

    const postingHref = `/post/${posting.id}`;
    return (
        <DropdownMenuItems items={[
            {
                title: t("copy-link"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onShare,
                show: true
            },
            {
                title: t("reply"),
                nodeName: REL_HOME,
                href: "/compose",
                onClick: onReply,
                show: homeOwnerName != null
            },
            {
                title: t("follow-comments"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onFollowComments,
                show: homeOwnerName != null && !followingComments
            },
            {
                title: t("unfollow-comments"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onUnfollowComments,
                show: followingComments
            },
            {
                divider: true
            },
            {
                title: t("edit"),
                nodeName: REL_HOME,
                href: `/compose?id=${postingId}`,
                show: postingEditable
            },
            {
                title: story != null && !story.pinned ? t("pin") : t("unpin"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onPin,
                show: storyEditable
            },
            {
                title: t("change-date-time"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onChangeDate,
                show: posting.receiverName == null && storyEditable
            },
            {
                divider: true
            },
            {
                title: t("dont-recommend"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onDontRecommend,
                show: posting.recommended ?? false
            },
            {
                title: t("tune-recommendations"),
                nodeName: REL_HOME,
                href: "/settings/node#news",
                show: posting.recommended ?? false
            },
            {
                divider: true
            },
            {
                title: t("view-source"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onDelete,
                show: postingDeletable
            },
            {
                divider: true
            },
            {
                title: t("show-hidden-comments"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onShowInvisibleComments,
                show: containsInvisibleComments && !showInvisibleComments
            },
            {
                title: t("hide-hidden-comments"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onHideInvisibleComments,
                show: containsInvisibleComments && showInvisibleComments
            },
            {
                divider: true
            },
            {
                title: t("hide-in-google-play"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onHideInGooglePlay,
                show: googlePlaySheriff && (!googlePlayProhibited || !googlePlayGoverned)
            },
            {
                title: t("unhide-in-google-play"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onUnhideInGooglePlay,
                show: googlePlaySheriff && (googlePlayProhibited || googlePlayGoverned)
            },
            {
                title: t("report-sheriff"),
                nodeName: REL_CURRENT,
                href: postingHref,
                onClick: onHideInGooglePlay,
                show: homeOwnerName != null && !googlePlaySheriff && !ownPosting
            }
        ]}/>
    );
}

const PostingMenu = ({posting, story, detailed}: Props) =>
    <DropdownMenu content={
        <PostingMenuItems posting={posting} story={story} detailed={detailed}/>
    }/>;

export default PostingMenu;
