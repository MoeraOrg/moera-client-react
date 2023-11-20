import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { composePreview } from "state/compose/actions";
import { Button } from "ui/control";
import "./ComposePreviewButton.css";

interface Props {
    disabled: boolean;
}

export default function ComposePreviewButton({disabled}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => {
        dispatch(composePreview());
        event.preventDefault();
    }

    return (
        <Button variant="secondary" className="preview-button" disabled={disabled} onClick={onClick}>
            {t("preview")}
        </Button>
    );
}
