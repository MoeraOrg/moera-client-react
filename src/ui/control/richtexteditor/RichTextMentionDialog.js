import React from 'react';
import PropType from 'prop-types';

import { ModalDialog } from "ui/control/ModalDialog";
import { NameSelector } from "ui/control/NameSelector";

export default class RichTextMentionDialog extends React.PureComponent {

    static propTypes = {
        show: PropType.bool,
        onSubmit: PropType.func
    }

    state = {
        query: ""
    }

    onChange = query => {
        this.setState({query});
    }

    onSubmit = (success, data) => {
        this.props.onSubmit(success, data);
    }

    onClose = () => {
        this.onSubmit(false, {nodeName: this.state.query});
    }

    render() {
        const {show} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog title="Insert a mention" onClose={this.onClose}>
                <div className="modal-body">
                    <NameSelector onSubmit={this.onSubmit} onChange={this.onChange}/>
                </div>
            </ModalDialog>
        );
    }

}
