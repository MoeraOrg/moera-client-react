import React from 'react';
import { useFormikContext } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

export default function ComposeReactionsButton() {
    const {values} = useFormikContext();

    const changed = values.reactionsPositive !== values.reactionsPositiveDefault
        || values.reactionsNegative !== values.reactionsNegativeDefault
        || values.reactionsVisible !== values.reactionsVisibleDefault
        || values.reactionTotalsVisible !== values.reactionTotalsVisibleDefault;
    return <ComposeIconButton icon="thumbs-up" name="reactionVisible" tooltip="Reactions" changed={changed}/>;
};
