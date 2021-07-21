import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button } from "ui/control";
import { composePreview } from "state/compose/actions";
import "./ComposePreviewButton.css";

type Props = {
    disabled: boolean;
} & ConnectedProps<typeof connector>;

class ComposePreviewButton extends React.PureComponent<Props> {

    onClick = (event: React.MouseEvent) => {
        const {composePreview} = this.props;

        composePreview();
        event.preventDefault();
    }

    render() {
        const {disabled} = this.props;

        return (
            <Button variant="secondary" className="preview-button" disabled={disabled} onClick={this.onClick}>
                PREVIEW
            </Button>
        );
    }

}

const connector = connect(
    null,
    { composePreview }
);

export default connector(ComposePreviewButton);
