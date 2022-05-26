import React from 'react';
import { useFormikContext } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";
import { ComposePageValues } from "ui/compose/compose-page-logic";

export default function ComposeCommentsButton() {
    const {values} = useFormikContext<ComposePageValues>();

    const changed = values.viewCommentsPrincipal !== values.viewCommentsPrincipalDefault
        || values.addCommentPrincipal !== values.addCommentPrincipalDefault;
    return <ComposeIconButton icon="comment" name="comments" tooltip="Comments" changed={changed}/>;
}
