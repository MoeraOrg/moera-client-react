import React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckboxField, PrincipalField } from "ui/control/field";

export default function ComposeComments() {
    const {t} = useTranslation();

    return (
        <div className="ps-2 pb-2">
            <PrincipalField name="viewCommentsPrincipal"
                            values={["public", "signed", "subscribed", "friends", "private", "none"]}
                            title={t("comments-visible-to")} long setting="posting.comments.visibility.default"
                            groupClassName="mb-1"/>
            <PrincipalField name="addCommentPrincipal"
                            values={["signed", "subscribed", "friends", "private", "none"]}
                            title={t("commenting-allowed-to")} long setting="posting.comments.addition.default"/>
            <CheckboxField name="hideComments" title={t("auto-hide-comments")}
                           setting="posting.comments.hide.default" anyValue labelClassName="mb-0"
                           groupClassName="mb-0"/>
        </div>
    );
}
