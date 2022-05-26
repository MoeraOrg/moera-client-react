import React from 'react';
import { useField } from 'formik';

import { CheckboxField, EmojiListInputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeReactions = () => {
    const [, {value: reactionsEnabled}] = useField<boolean>("reactionsEnabled");
    const [, {value: reactionsNegativeEnabled}] = useField<boolean>("reactionsNegativeEnabled");

    return (
        <ComposePageTool name="reactions">
            <CheckboxField title="Enable reactions" name="reactionsEnabled" groupClassName="ps-2"
                           setting="posting.reactions.enabled.default"/>
            {reactionsEnabled &&
                <>
                    <EmojiListInputField title={"Allowed \"Support\" reactions"} name="reactionsPositive" horizontal
                                         layout="left" groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8"
                                         negative={false} setting="posting.reactions.positive.default"/>
                    <CheckboxField title={"Enable \"Oppose\" reactions"} name="reactionsNegativeEnabled"
                                   groupClassName="ps-2" setting="posting.reactions.negative.enabled.default"/>
                    {reactionsNegativeEnabled &&
                        <EmojiListInputField title={"Allowed \"Oppose\" reactions"} name="reactionsNegative" horizontal
                                             layout="left" groupClassName="ps-2" labelClassName="col-md-3"
                                             col="col-md-8" negative={true}
                                             setting="posting.reactions.negative.default"/>
                    }
                    <CheckboxField title="Show the detailed list of reactions" name="reactionsVisible"
                                   groupClassName="ps-2" setting="posting.reactions.visible.default"/>
                    <CheckboxField title="Show the number of reactions" name="reactionTotalsVisible"
                                   groupClassName="ps-2" setting="posting.reactions.totals-visible.default"/>
                </>
            }
        </ComposePageTool>
    );
}

export default ComposeReactions;
