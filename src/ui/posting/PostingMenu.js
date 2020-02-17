import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { goToCompose } from "state/navigation/actions";
import { confirmBox } from "state/confirmbox/actions";
import { postingDelete, postingPinningUpdate } from "state/postings/actions";
import "./PostingMenu.css";

class PostingMenu extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPin = this.onPin.bind(this);
    }

    onEdit() {
        const {posting, goToCompose} = this.props;

        goToCompose(posting.id);
    }

    onDelete() {
        const {posting, confirmBox} = this.props;

        confirmBox(`Do you really want to delete the post "${posting.heading}"?`, "Delete", "Cancel",
            postingDelete(posting.id), null, "danger");
    }

    onPin() {
        const {posting, postingPinningUpdate} = this.props;

        postingPinningUpdate(posting.id, !posting.pinned);
    }

    render() {
        const {posting, isPermitted, rootLocation} = this.props;

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
                    show: !posting.pinned && isPermitted("edit", posting)
                },
                {
                    title: "Unpin",
                    href: `${rootLocation}/moera/post/${posting.id}`,
                    onClick: this.onPin,
                    show: posting.pinned && isPermitted("edit", posting)
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
    {goToCompose, confirmBox, postingPinningUpdate}
)(PostingMenu);
