import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { postingDelete } from "state/postings/actions";
import { commentCopyLink } from "state/detailedposting/actions";

class CommentMenu extends React.PureComponent {

    onCopyLink = () => {
        const {postingId, comment, commentCopyLink} = this.props;

        commentCopyLink(comment.id, postingId);
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

    render() {
        const {postingId, comment, isPermitted, rootLocation} = this.props;

        return (
            <DropdownMenu items={[
                {
                    title: "Copy link",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onCopyLink,
                    show: true
                },
                {
                    title: "Edit...",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onEdit,
                    show: isPermitted("edit", comment),
                },
                {
                    title: "Delete",
                    href: `${rootLocation}/moera/post/${postingId}?comment=${comment.id}`,
                    onClick: this.onDelete,
                    show: isPermitted("delete", comment),
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
    { commentCopyLink }
)(CommentMenu);
