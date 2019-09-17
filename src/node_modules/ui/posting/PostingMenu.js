import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";
import { goToCompose } from "state/navigation/actions";
import { confirmBox } from "state/confirmbox/actions";
import { postingDelete } from "state/postings/actions";
import "./PostingMenu.css";

const PostingMenu = ({posting, isPermitted, rootLocation, goToCompose, confirmBox}) => (
    <DropdownMenu items={[
        {
            title: "Edit...",
            href: `${rootLocation}/moera/compose?id=${posting.id}`,
            onClick: () => goToCompose(posting.id),
            show: isPermitted("edit", posting)
        },
        {
            title: "Delete",
            href: `${rootLocation}/moera/post/${posting.id}`,
            onClick: () => confirmBox(`Do you really want to delete the post "${posting.heading}"?`, "Delete", "Cancel",
                postingDelete(posting.id), null, "danger"),
            show: isPermitted("delete", posting)
        }
    ]}/>
);

export default connect(
    state => ({
        rootLocation: state.node.root.location,
    }),
    {goToCompose, confirmBox}
)(PostingMenu);
