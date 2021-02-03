import React from 'react';

import { Button } from "ui/control";
import "./ComposeSubmitButton.css";

const ComposeSubmitButton = ({loading, update, disabled}) => {
    const title = !update ? "POST" : "UPDATE";
    return (
        <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
            {title}
        </Button>
    );
};

export default ComposeSubmitButton;
