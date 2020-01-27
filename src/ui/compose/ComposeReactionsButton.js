import React from 'react';
import { connect as connectFormik } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

const ComposeReactionsButton = ({formik}) => {
    const changed = formik.values.reactionsPositive !== formik.values.reactionsPositiveDefault
        || formik.values.reactionsNegative !== formik.values.reactionsNegativeDefault;
    return <ComposeIconButton icon="thumbs-up" name="reactionsVisible" changed={changed}/>;
};

export default connectFormik(ComposeReactionsButton);
