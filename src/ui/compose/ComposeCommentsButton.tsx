import React from 'react';
import { useFormikContext } from 'formik';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import ComposeIconButton from "ui/compose/ComposeIconButton";
import { ComposePageValues } from "ui/compose/posting-compose";

export default function ComposeCommentsButton() {
    const {values} = useFormikContext<ComposePageValues>();
    const {t} = useTranslation();

    const changed = values.viewCommentsPrincipal !== values.viewCommentsPrincipalDefault
        || values.addCommentPrincipal !== values.addCommentPrincipalDefault;
    return <ComposeIconButton icon={faComment} name="comments" tooltip={t("comments")} changed={changed}/>;
}
