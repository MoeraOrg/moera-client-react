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
import "./EntryMenu.css";
import { getHomeOwnerName } from "state/home/selectors";

class PostingMenu extends React.PureComponent {

    onCopyLink = () => {
        const {posting, postingCopyLink} = this.props;

        postingCopyLink(posting.id);
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

    render() {
        const {posting, story, isPermitted, rootLocation, homeOwnerName} = this.props;

        return (
            <DropdownMenu items={[
                {
                    title: "Copy link",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onCopyLink,
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
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onFollowComments,
                    show: posting.ownerName !== homeOwnerName && posting.subscriptions.comments == null
                },
                {
                    title: "Unfollow comments",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onUnfollowComments,
                    show: posting.ownerName !== homeOwnerName && posting.subscriptions.comments != null
                },
                {
                    title: "Edit...",
                    href: `${rootLocation}/moera/compose?id=${posting.id}`,
                    onClick: this.onEdit,
                    show: isPermitted("edit", posting),
                    divider: true
                },
                {
                    title: "Pin",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onPin,
                    show: story != null && !story.pinned && isPermitted("edit", story)
                },
                {
                    title: "Unpin",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onPin,
                    show: story != null && story.pinned && isPermitted("edit", story)
                },
                {
                    title: "Change date/time...",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onChangeDate,
                    show: isPermitted("edit", story)
                },
                {
                    title: "Delete",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onDelete,
                    show: isPermitted("delete", posting),
                    divider: true
                }
            ]}/>
        );
    }

}

export default connect(
    state => ({
        rootLocation: state.node.root.location,
        homeOwnerName: getHomeOwnerName(state)
    }),
    {
        goToCompose, confirmBox, storyPinningUpdate, openChangeDateDialog, postingCopyLink, postingReply,
        postingCommentsSubscribe, postingCommentsUnsubscribe
    }
)(PostingMenu);
