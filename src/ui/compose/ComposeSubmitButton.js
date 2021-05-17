import React from 'react';

import { Button } from "ui/control";
import "./ComposeSubmitButton.css";

const ComposeSubmitButton = ({loading, update, disabled}) => (
    <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
        {!update ? "POST" : "UPDATE"}
    </Button>
);

export default ComposeSubmitButton;
