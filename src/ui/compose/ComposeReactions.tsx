import React from 'react';
import { useField } from 'formik';

import { CheckboxField, EmojiListInputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeReactions = () => {
    const [, {value: reactionsEnabled}] = useField<boolean>("reactionsEnabled");
    const [, {value: reactionsNegativeEnabled}] = useField<boolean>("reactionsNegativeEnabled");

    return (
        <ComposePageTool name="reactions">
            <CheckboxField title="Enable reactions" name="reactionsEnabled" groupClassName="ps-2"/>
            {reactionsEnabled &&
                <>
                    <EmojiListInputField title={"Allowed \"Support\" reactions"} name="reactionsPositive" horizontal
                                         groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8"
                                         negative={false}/>
                    <CheckboxField title={"Enable \"Oppose\" reactions"} name="reactionsNegativeEnabled"
                                   groupClassName="ps-2"/>
                    {reactionsNegativeEnabled &&
                        <EmojiListInputField title={"Allowed \"Oppose\" reactions"} name="reactionsNegative" horizontal
                                             groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8"
                                             negative={true}/>
                    }
                    <CheckboxField title="Show the detailed list of reactions" name="reactionsVisible"
                                   groupClassName="ps-2"/>
                    <CheckboxField title="Show the number of reactions" name="reactionTotalsVisible"
                                   groupClassName="ps-2"/>
                </>
            }
        </ComposePageTool>
    );
}

export default ComposeReactions;
