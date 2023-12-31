import React from 'react';
import { useFormikContext } from 'formik';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import ComposeIconButton from "ui/compose/ComposeIconButton";
import { ComposePageValues } from "ui/compose/posting-compose";

export default function ComposeReactionsButton() {
    const {values} = useFormikContext<ComposePageValues>();
    const {t} = useTranslation();

    const changed = values.reactionsEnabled !== values.reactionsEnabledDefault
        || values.reactionsNegativeEnabled !== values.reactionsNegativeEnabledDefault
        || values.reactionsPositive !== values.reactionsPositiveDefault
        || values.reactionsNegative !== values.reactionsNegativeDefault
        || values.reactionsVisible !== values.reactionsVisibleDefault
        || values.reactionTotalsVisible !== values.reactionTotalsVisibleDefault;
    return <ComposeIconButton icon={faThumbsUp} name="reactions" tooltip={t("reactions")} changed={changed}/>;
};
