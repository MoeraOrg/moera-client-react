import React from 'react';

import { PrincipalField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeComments = () => (
    <ComposePageTool name="comments">
        <PrincipalField name="viewCommentsPrincipal" values={["none", "private", "signed", "public"]}
                        title="Comments visible to" long setting="posting.comments.visibility.default"
                        groupClassName="ps-2 pb-2"/>
    </ComposePageTool>
);

export default ComposeComments;
