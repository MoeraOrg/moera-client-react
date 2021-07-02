import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
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
import { getHomeOwnerName } from "state/home/selectors";
import { getNodeRootLocation } from "state/node/selectors";
import "./EntryMenu.css";

class PostingMenu extends React.PureComponent {

    onCopyLink = () => {
        const {posting, postingCopyLink} = this.props;

        postingCopyLink(posting.id);
    };

    onShare = () => {
        const {posting, shareDialogPrepare} = this.props;

        const nodeName = posting.receiverName ?? posting.ownerName;
        const postingId = posting.receiverPostingId ?? posting.id;
        const href = `/post/${postingId}`;

        shareDialogPrepare(posting.heading, nodeName, href);
    };

    onReply = () => {
        const {posting, postingReply} = this.props;

        postingReply(posting.id);
    };

    onEdit = () => {
        const {posting, goToCompose} = this.props;

        goToCompose(posting.id);
    };

    onFollowComments = () => {
        const {posting, postingCommentsSubscribe} = this.props;

        postingCommentsSubscribe(posting.id);
    };

    onUnfollowComments = () => {
        const {posting, postingCommentsUnsubscribe} = this.props;

        postingCommentsUnsubscribe(posting.id);
    };

    onDelete = () => {
        const {posting, confirmBox} = this.props;

        confirmBox(`Do you really want to delete the post "${posting.heading}"?`, "Delete", "Cancel",
            postingDelete(posting.id), null, "danger");
    };

    onPin = () => {
        const {story, storyPinningUpdate} = this.props;

        storyPinningUpdate(story.id, !story.pinned);
    };

    onChangeDate = () => {
        const {story, openChangeDateDialog} = this.props;

        openChangeDateDialog(story.id, story.publishedAt);
    };

    onViewSource = () => {
        const {posting, openSourceDialog} = this.props;

        if (posting.receiverName == null) {
            openSourceDialog("", posting.id);
        } else {
            openSourceDialog(posting.receiverName, posting.receiverPostingId);
        }
    };

    render() {
        const {posting, story, isPermitted, rootLocation, homeOwnerName} = this.props;

        const postingHref = `${rootLocation}/moera/post/${posting.id}`;
        return (
            <DropdownMenu items={[
                {
                    title: "Copy link",
                    href: postingHref,
                    onClick: this.onCopyLink,
                    show: true
                },
                {
                    title: "Share...",
                    href: postingHref,
                    onClick: this.onShare,
                    show: true
                },
                {
                    title: "Reply...",
                    href: `${rootLocation}/moera/compose`,
                    onClick: this.onReply,
                    show: true
                },
                {
                    title: "Follow comments",
                    href: postingHref,
                    onClick: this.onFollowComments,
                    show: posting.ownerName !== homeOwnerName && posting.subscriptions.comments == null
                },
                {
                    title: "Unfollow comments",
                    href: postingHref,
                    onClick: this.onUnfollowComments,
                    show: posting.ownerName !== homeOwnerName && posting.subscriptions.comments != null
                },
                {
                    divider: true
                },
                {
                    title: "Edit...",
                    href: `${rootLocation}/moera/compose?id=${posting.id}`,
                    onClick: this.onEdit,
                    show: isPermitted("edit", posting)
                },
                {
                    title: story != null && !story.pinned ? "Pin" : "Unpin",
                    href: postingHref,
                    onClick: this.onPin,
                    show: story != null && isPermitted("edit", story)
                },
                {
                    title: "Change date/time...",
                    href: postingHref,
                    onClick: this.onChangeDate,
                    show: posting.receiverName == null && isPermitted("edit", story)
                },
                {
                    divider: true
                },
                {
                    title: "View source",
                    href: postingHref,
                    onClick: this.onViewSource,
                    show: true
                },
                {
                    title: "Delete",
                    href: postingHref,
                    onClick: this.onDelete,
                    show: isPermitted("delete", posting)
                }
            ]}/>
        );
    }

}

export default connect(
    state => ({
        rootLocation: getNodeRootLocation(state),
        homeOwnerName: getHomeOwnerName(state)
    }),
    {
        goToCompose, confirmBox, storyPinningUpdate, openChangeDateDialog, postingCopyLink, postingReply,
        postingCommentsSubscribe, postingCommentsUnsubscribe, openSourceDialog, shareDialogPrepare
    }
)(PostingMenu);
