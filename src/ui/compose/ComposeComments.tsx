import React from 'react';
import { useField } from 'formik';

import { PrincipalField } from "ui/control/field";
import { ComposePageToolsTab } from "ui/compose/compose-page-logic";

export default function ComposeComments() {
    const [, {value}] = useField<ComposePageToolsTab>("toolsTab");

    if (value !== "comments") {
        return null;
    }

    return (
        <div className="p-2 mb-3">
            Comments visible to <PrincipalField name="viewCommentsPrincipal" long/>
        </div>
    );
}
