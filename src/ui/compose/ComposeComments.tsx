import React from 'react';
import { useField } from 'formik';

import { PrincipalField } from "ui/control/field";

export default function ComposeComments() {
    const [, {value}] = useField<boolean>("commentVisible");

    if (!value) {
        return null;
    }

    return (
        <div className="p-2">
            Comments visible to <PrincipalField name="viewCommentsPrincipal" long/>
        </div>
    );
}
