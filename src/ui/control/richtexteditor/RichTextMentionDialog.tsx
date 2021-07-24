import React from 'react';
import PropType from 'prop-types';

import { ModalDialog } from "ui/control/ModalDialog";
import { NameSelector } from "ui/control/NameSelector";
import { NameListItem } from "util/names-list";

type Props = {
    show: boolean;
    onSubmit: (ok: boolean, values: NameListItem) => void;
};

type State = {
    query: string;
};

export default class RichTextMentionDialog extends React.PureComponent<Props, State> {

    static propTypes = {
        show: PropType.bool,
        onSubmit: PropType.func
    }

    state = {
        query: ""
    }

    onChange = (query: string | null) => {
        this.setState({query: query ?? ""});
    }

    onSubmit = (success: boolean, data: NameListItem) => {
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
            <ModalDialog title="Insert a mention" centered={false} onClose={this.onClose}>
                <div className="modal-body">
                    <NameSelector onSubmit={this.onSubmit} onChange={this.onChange}/>
                </div>
            </ModalDialog>
        );
    }

}
