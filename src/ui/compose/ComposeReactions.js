import React from 'react';
import { connect as connectFormik } from 'formik';

import { EmojiListInputField } from "ui/control/field";

const ComposeReactions = ({formik}) => (
    formik.values.reactionsCustomized &&
        <>
            <EmojiListInputField title={"Allowed \"Support\" reactions"} name="reactionsPositive" horizontal={true}
                                 groupClassName="pl-2" labelClassName="col-md-3" col="col-md-8" negative={false}
                                 anyValue/>
            <EmojiListInputField title={"Allowed \"Oppose\" reactions"} name="reactionsNegative" horizontal={true}
                                 groupClassName="pl-2" labelClassName="col-md-3" col="col-md-8" negative={true}
                                 anyValue/>
        </>
);

export default connectFormik(ComposeReactions);
