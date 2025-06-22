import React, { useRef } from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { dispatch } from "state/store-sagas";
import { ExtStoryInfo } from "state/feeds/state";
import { reminderFullNameUpdate } from "state/stories/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import StoryMenu from "ui/story/StoryMenu";
import StoryBadges from "ui/story/StoryBadges";

const NAME_EXAMPLES = [
    {name: "harrp", full: "Harry Potter"},
    {name: "Arthur_Earth", full: "Arthur Philip Dent"},
    {name: "luffy1990", full: "Monkey D. Luffy"}
]

interface OuterProps {
    feedName: string;
    story: ExtStoryInfo;
}

interface Values {
    fullName: string;
}

type Props = OuterProps & FormikProps<Values>;

function ReminderFullNameStoryInner({feedName, story, values, isSubmitting}: Props) {
    const example = useRef(NAME_EXAMPLES[Math.floor(Math.random() * NAME_EXAMPLES.length)]);
    const {t} = useTranslation();

    return (
        <>
            <StoryMenu story={{...story, feedName}}/>
            <StoryBadges pinned={story.pinned}/>
            <div className="content me-3">
                <p>
                    <Trans i18nKey="why-not-set-full-name" values={example.current}>
                        <span className="fs-5 fw-bold me-2"/>
                        <b/>
                    </Trans>
                </p>
                <p>{t("want-set-right-now")}</p>
                <Form className="row gx-2 ms-2 me-2">
                    <InputField name="fullName" maxLength={96} placeholder={t("full-name")}
                                groupClassName="col-md-10 col-8 mb-0" anyValue autoFocus/>
                    <div className="col-md-2 col-4">
                        <Button variant="primary" type="submit" loading={isSubmitting}
                                disabled={values.fullName.trim() === ''}>{t("update")}</Button>
                    </div>
                </Form>
                <p className="ms-3 text-body-tertiary">{t("new-name-new-posts")}</p>
            </div>
        </>
    );
}

const reminderFullNameStoryLogic = {

    mapPropsToValues: (): Values => ({
        fullName: ""
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(reminderFullNameUpdate(values.fullName));
    }

};

const ReminderFullNameStory = withFormik(reminderFullNameStoryLogic)(ReminderFullNameStoryInner);

export default ReminderFullNameStory;
