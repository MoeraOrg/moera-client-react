import React from 'react';

import { CheckboxField, PrincipalField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeComments = () => (
    <ComposePageTool name="comments">
        <div className="ps-2 pb-2">
            <PrincipalField name="viewCommentsPrincipal" values={["public", "signed", "private", "none"]}
                            title="Comments visible to" long setting="posting.comments.visibility.default"
                            groupClassName="mb-1"/>
            <PrincipalField name="addCommentPrincipal" values={["signed", "private", "none"]}
                            title="Commenting allowed to" long setting="posting.comments.addition.default"/>
            <CheckboxField name="hideComments" title="Automatically hide comments"
                           setting="posting.comments.hide.default"/>
        </div>
    </ComposePageTool>
);

export default ComposeComments;
