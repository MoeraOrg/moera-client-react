import React from 'react';
import { connect as connectFormik } from 'formik';

import { Button } from "ui/control";

const ComposeSubmitButton = ({loading, update, formik}) => {
    const disabled = formik.values["body"].trim().length === 0;
    const title = !update ? "POST" : "UPDATE";
    return (
        <Button variant="primary" className="submit-button" type="submit" loading={loading} disabled={disabled}>
            {title}
        </Button>
    );
};

export default connectFormik(ComposeSubmitButton);
