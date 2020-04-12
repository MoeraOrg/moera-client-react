import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { goToCompose } from "state/navigation/actions";
import { confirmBox } from "state/confirmbox/actions";
import { postingDelete } from "state/postings/actions";
import { storyPinningUpdate } from "state/stories/actions";
import "./PostingMenu.css";

class PostingMenu extends React.PureComponent {

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

    render() {
        const {posting, story, isPermitted, rootLocation} = this.props;

        return (
            <DropdownMenu items={[
                {
                    title: "Edit...",
                    href: `${rootLocation}/moera/compose?id=${posting.id}`,
                    onClick: this.onEdit,
                    show: isPermitted("edit", posting)
                },
                {
                    title: "Pin",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onPin,
                    show: !story.pinned && isPermitted("edit", posting)
                },
                {
                    title: "Unpin",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onPin,
                    show: story.pinned && isPermitted("edit", posting)
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
    {goToCompose, confirmBox, storyPinningUpdate}
)(PostingMenu);
