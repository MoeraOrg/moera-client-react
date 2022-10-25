import React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckboxField, PrincipalField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeComments = () => {
    const {t} = useTranslation();

    return (
        <ComposePageTool name="comments">
            <div className="ps-2 pb-2">
                <PrincipalField name="viewCommentsPrincipal" values={["public", "signed", "private", "none"]}
                                title={t("comments-visible-to")} long setting="posting.comments.visibility.default"
                                groupClassName="mb-1"/>
                <PrincipalField name="addCommentPrincipal" values={["signed", "private", "none"]}
                                title={t("commenting-allowed-to")} long setting="posting.comments.addition.default"/>
                <CheckboxField name="hideComments" title={t("auto-hide-comments")}
                               setting="posting.comments.hide.default" anyValue/>
            </div>
        </ComposePageTool>
    );
}

export default ComposeComments;
