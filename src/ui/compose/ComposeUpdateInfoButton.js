import React from 'react';
import { connect as connectFormik } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

const ComposeUpdateInfoButton = ({formik}) => {
    const changed = formik.values.updateImportant || formik.values.updateDescription;
    return <ComposeIconButton icon="bell" name="updateInfoVisible" changed={changed} tooltip="Notify followers"/>
};

export default connectFormik(ComposeUpdateInfoButton);
