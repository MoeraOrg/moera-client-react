import React from 'react';

import { PrincipalField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeComments = () => (
    <ComposePageTool name="comments">
        <div className="ps-2 pb-2">
            <PrincipalField name="viewCommentsPrincipal" values={["public", "signed", "private", "none"]}
                            title="Comments visible to" long setting="posting.comments.visibility.default"
                            groupClassName="mb-1"/>
            <PrincipalField name="addCommentPrincipal" values={["public", "signed", "private", "none"]}
                            title="Commenting allowed to" long setting="posting.comments.addition.default"/>
        </div>
    </ComposePageTool>
);

export default ComposeComments;
