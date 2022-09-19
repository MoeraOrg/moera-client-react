import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PostingInfo, PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { goToCompose } from "state/navigation/actions";
import { confirmBox } from "state/confirmbox/actions";
import {
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
import { getNodeRootLocation, ProtectedObject } from "state/node/selectors";
import { MinimalStoryInfo } from "ui/types";
import { DropdownMenu } from "ui/control";
import "ui/entry/EntryMenu.css";

type Props = {
    posting: PostingInfo;
    story: MinimalStoryInfo;
    isPermitted: (operation: string, object: ProtectedObject, defaultValue: PrincipalValue) => boolean;
} & ConnectedProps<typeof connector>;

function PostingMenu({
     posting, story, isPermitted, rootLocation, homeOwnerName, goToCompose, confirmBox, storyPinningUpdate,
     openChangeDateDialog, postingCopyLink, postingReply, postingCommentsSubscribe, postingCommentsUnsubscribe,
     openSourceDialog, shareDialogPrepare, entryCopyText
}: Props) {
    const {t} = useTranslation();

    const onCopyLink = () => postingCopyLink(posting.id);

    const onCopyText = () => entryCopyText(posting.body, "ask", posting.receiverName ?? "", posting.media ?? null);

    const onShare = () => {
        const nodeName = posting.receiverName ?? posting.ownerName;
        const postingId = posting.receiverPostingId ?? posting.id;
        const href = `/post/${postingId}`;

        shareDialogPrepare(nodeName, href);
    };

    const onReply = () => postingReply(posting.id);

    const onEdit = () => goToCompose(posting.id);

    const onFollowComments = () => postingCommentsSubscribe(posting.id);

    const onUnfollowComments = () => postingCommentsUnsubscribe(posting.id);

    const onDelete = () => {
        confirmBox(`Do you really want to delete the post "${posting.heading}"?`, "Delete", "Cancel",
            postingDelete(posting.id), null, "danger");
    };

    const onPin = () => storyPinningUpdate(story.id, !story.pinned);

    const onChangeDate = () => openChangeDateDialog(story.id, story.publishedAt);

    const onViewSource = () => {
        if (posting.receiverName == null) {
            openSourceDialog("", posting.id);
        } else {
            if (posting.receiverPostingId != null) {
                openSourceDialog(posting.receiverName, posting.receiverPostingId);
            }
        }
    };

    const postingHref = `${rootLocation}/moera/post/${posting.id}`;
    return (
        <DropdownMenu items={[
            {
                title: t("copy-link"),
                href: postingHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("copy-text"),
                href: postingHref,
                onClick: onCopyText,
                show: true
            },
            {
                title: t("share-ellipsis"),
                href: postingHref,
                onClick: onShare,
                show: true
            },
            {
                title: t("reply-ellipsis"),
                href: `${rootLocation}/moera/compose`,
                onClick: onReply,
                show: true
            },
            {
                title: t("follow-comments"),
                href: postingHref,
                onClick: onFollowComments,
                show: posting.ownerName !== homeOwnerName && posting.subscriptions?.comments == null
            },
            {
                title: t("unfollow-comments"),
                href: postingHref,
                onClick: onUnfollowComments,
                show: posting.ownerName !== homeOwnerName && posting.subscriptions?.comments != null
            },
            {
                divider: true
            },
            {
                title: t("edit-ellipsis"),
                href: `${rootLocation}/moera/compose?id=${posting.id}`,
                onClick: onEdit,
                show: isPermitted("edit", posting, "owner")
            },
            {
                title: story != null && !story.pinned ? t("pin") : t("unpin"),
                href: postingHref,
                onClick: onPin,
                show: story != null && (isPermitted("edit", story, "admin"))
            },
            {
                title: t("change-date-time-ellipsis"),
                href: postingHref,
                onClick: onChangeDate,
                show: posting.receiverName == null && (isPermitted("edit", story, "admin"))
            },
            {
                divider: true
            },
            {
                title: t("view-source"),
                href: postingHref,
                onClick: onViewSource,
                show: true
            },
            {
                title: t("delete"),
                href: postingHref,
                onClick: onDelete,
                show: isPermitted("delete", posting, "private")
            }
        ]}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        rootLocation: getNodeRootLocation(state),
        homeOwnerName: getHomeOwnerName(state)
    }),
    {
        goToCompose, confirmBox, storyPinningUpdate, openChangeDateDialog, postingCopyLink, postingReply,
        postingCommentsSubscribe, postingCommentsUnsubscribe, openSourceDialog, shareDialogPrepare, entryCopyText
    }
);

export default connector(PostingMenu);
