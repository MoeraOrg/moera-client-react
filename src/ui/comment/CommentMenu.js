import React from 'react';
import { connect } from 'react-redux';

import { DropdownMenu } from "ui/control";

class CommentMenu extends React.PureComponent {

    render() {
        const {comment, isPermitted, rootLocation} = this.props;

        return (
            <DropdownMenu items={[
            ]}/>
        );
    }

}

export default connect(
    state => ({
        rootLocation: state.node.root.location,
    }),
    {}
)(CommentMenu);
