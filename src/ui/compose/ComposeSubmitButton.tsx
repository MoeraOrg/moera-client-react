import React from 'react';

import { Button } from "ui/control";
import "./ComposeSubmitButton.css";

interface Props {
    loading: boolean;
    update: boolean;
    disabled: boolean;
}

const ComposeSubmitButton = ({loading, update, disabled}: Props) => (
    <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
        {!update ? "POST" : "UPDATE"}
    </Button>
);

export default ComposeSubmitButton;
