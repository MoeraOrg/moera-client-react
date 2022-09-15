import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { CheckboxField, EmojiListInputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

const ComposeReactions = () => {
    const [, {value: reactionsEnabled}] = useField<boolean>("reactionsEnabled");
    const [, {value: reactionsNegativeEnabled}] = useField<boolean>("reactionsNegativeEnabled");

    const {t} = useTranslation();

    return (
        <ComposePageTool name="reactions">
            <CheckboxField title={t("enable-reactions")} name="reactionsEnabled" groupClassName="ps-2"
                           setting="posting.reactions.enabled.default"/>
            {reactionsEnabled &&
                <>
                    <EmojiListInputField title={t("allowed-support-reactions")} name="reactionsPositive" horizontal
                                         layout="left" groupClassName="ps-2" labelClassName="col-md-3" col="col-md-8"
                                         negative={false} setting="posting.reactions.positive.default"/>
                    <CheckboxField title={t("enable-oppose-reactions")} name="reactionsNegativeEnabled"
                                   groupClassName="ps-2" setting="posting.reactions.negative.enabled.default"/>
                    {reactionsNegativeEnabled &&
                        <EmojiListInputField title={t("allowed-oppose-reactions")} name="reactionsNegative" horizontal
                                             layout="left" groupClassName="ps-2" labelClassName="col-md-3"
                                             col="col-md-8" negative={true}
                                             setting="posting.reactions.negative.default"/>
                    }
                    <CheckboxField title={t("show-list-reactions")} name="reactionsVisible"
                                   groupClassName="ps-2" setting="posting.reactions.visible.default"/>
                    <CheckboxField title={t("show-number-reactions")} name="reactionTotalsVisible"
                                   groupClassName="ps-2" setting="posting.reactions.totals-visible.default"/>
                </>
            }
        </ComposePageTool>
    );
}

export default ComposeReactions;
