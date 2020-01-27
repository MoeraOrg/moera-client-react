import React from 'react';
import { connect as connectFormik } from 'formik';

import { CheckboxField, EmojiListInputField } from "ui/control/field";

const ComposeReactions = ({formik}) => (
    formik.values.reactionVisible &&
        <>
            <EmojiListInputField title={"Allowed \"Support\" reactions"} name="reactionsPositive" horizontal={true}
                                 groupClassName="pl-2" labelClassName="col-md-3" col="col-md-8" negative={false}
                                 anyValue/>
            <EmojiListInputField title={"Allowed \"Oppose\" reactions"} name="reactionsNegative" horizontal={true}
                                 groupClassName="pl-2" labelClassName="col-md-3" col="col-md-8" negative={true}
                                 anyValue/>
            <CheckboxField title="Show the detailed list of reactions" name="reactionsVisible" groupClassName="pl-2"/>
            <CheckboxField title="Show the number of reactions" name="reactionTotalsVisible" groupClassName="pl-2"/>
        </>
);

export default connectFormik(ComposeReactions);
