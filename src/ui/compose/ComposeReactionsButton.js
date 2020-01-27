import React from 'react';
import { connect as connectFormik } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

const ComposeReactionsButton = ({formik}) => {
    const changed = formik.values.reactionsPositive !== formik.values.reactionsPositiveDefault
        || formik.values.reactionsNegative !== formik.values.reactionsNegativeDefault
        || formik.values.reactionsVisible !== formik.values.reactionsVisibleDefault
        || formik.values.reactionTotalsVisible !== formik.values.reactionTotalsVisibleDefault;
    return <ComposeIconButton icon="thumbs-up" name="reactionVisible" changed={changed}/>;
};

export default connectFormik(ComposeReactionsButton);
