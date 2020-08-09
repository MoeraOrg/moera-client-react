import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { goToCompose } from "state/navigation/actions";
import { confirmBox } from "state/confirmbox/actions";
import { postingCopyLink, postingDelete } from "state/postings/actions";
import { postingReply } from "state/postingreply/actions";
import { storyPinningUpdate } from "state/stories/actions";
import { openChangeDateDialog } from "state/changedatedialog/actions";
import "./EntryMenu.css";

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
        const {posting, story, isPermitted, rootLocation} = this.props;

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
    }),
    { goToCompose, confirmBox, storyPinningUpdate, openChangeDateDialog, postingCopyLink, postingReply }
)(PostingMenu);
