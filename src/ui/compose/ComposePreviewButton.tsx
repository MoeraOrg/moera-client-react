import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import { composePreview } from "state/compose/actions";
import "./ComposePreviewButton.css";

type Props = {
    disabled: boolean;
} & ConnectedProps<typeof connector>;

function ComposePreviewButton({disabled, composePreview}: Props) {
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        composePreview();
        event.preventDefault();
    }

    return (
        <Button variant="secondary" className="preview-button" disabled={disabled} onClick={onClick}>
            {t("preview")}
        </Button>
    );
}

const connector = connect(
    null,
    { composePreview }
);

export default connector(ComposePreviewButton);
