import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import "./ComposeSubmitButton.css";

interface Props {
    loading: boolean;
    update: boolean;
    disabled: boolean;
}

const ComposeSubmitButton = ({loading, update, disabled}: Props) => {
    const {t} = useTranslation();

    return (
        <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
            {!update ? t("post-button") : t("update")}
        </Button>
    );
}

export default ComposeSubmitButton;
