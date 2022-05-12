import React from 'react';

import { CheckboxField, EmojiListInputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeReactions = () => (
    <ComposePageTool name="reactions">
        <EmojiListInputField title={"Allowed \"Support\" reactions"} name="reactionsPositive" horizontal
                             groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8" negative={false}/>
        <EmojiListInputField title={"Allowed \"Oppose\" reactions"} name="reactionsNegative" horizontal
                             groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8" negative={true}/>
        <CheckboxField title="Show the detailed list of reactions" name="reactionsVisible" groupClassName="ps-2"/>
        <CheckboxField title="Show the number of reactions" name="reactionTotalsVisible" groupClassName="ps-2"/>
    </ComposePageTool>
);

export default ComposeReactions;
