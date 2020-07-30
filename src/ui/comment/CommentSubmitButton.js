import React from 'react';
import { connect as connectFormik } from 'formik';

import { Button } from "ui/control";

const CommentSubmitButton = ({loading, update, formik}) => {
    const invisible = formik.values["body"].trim().length === 0;
    const title = !update ? "ADD COMMENT" : "UPDATE COMMENT";
    return (
        <Button variant="primary" className="submit-button" type="submit" loading={loading} invisible={invisible}>
            {title}
        </Button>
    );
};

export default connectFormik(CommentSubmitButton);
