import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { composePreview } from "state/compose/actions";
import "./ComposePreviewButton.css";

class ComposePreviewButton extends React.PureComponent {

    onClick = event => {
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

export default connect(
    null,
    { composePreview }
)(ComposePreviewButton);
