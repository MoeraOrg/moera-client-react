import React from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { dispatch } from "state/store-sagas";
import { ExtStoryInfo } from "state/feeds/state";
import { reminderEmailUpdate } from "state/stories/actions";
import { Button } from "ui/control";
import { InputField } from "ui/control/field";
import StoryMenu from "ui/story/StoryMenu";
import StoryBadges from "ui/story/StoryBadges";

interface OuterProps {
    feedName: string;
    story: ExtStoryInfo;
}

interface Values {
    email: string;
}

type Props = OuterProps & FormikProps<Values>;

function ReminderEmailStoryInner({feedName, story, values, isSubmitting}: Props) {
    const {t} = useTranslation();

    return (
        <>
            <StoryMenu story={{...story, feedName}}/>
            <StoryBadges pinned={story.pinned}/>
            <div className="content me-3">
                <p>
                    <Trans i18nKey="recommend-set-email">
                        <span className="fs-5 fw-bold me-2"/>
                    </Trans>
                </p>
                <p>{t("want-set-right-now")}</p>
                <Form className="row gx-2 ms-2 me-2">
                    <InputField type="email" name="email" maxLength={96} placeholder={t("email")}
                                groupClassName="col-lg-10 col-8 mb-0" anyValue autoFocus/>
                    <div className="col-lg-2 col-4">
                        <Button variant="primary" type="submit" loading={isSubmitting}
                                disabled={values.email.trim() === ''}>{t("update")}</Button>
                    </div>
                </Form>
            </div>
        </>
    );
}

const reminderEmailStoryLogic = {

    mapPropsToValues: (): Values => ({
        email: ""
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        dispatch(reminderEmailUpdate(values.email));
    }

};

const ReminderEmailStory = withFormik(reminderEmailStoryLogic)(ReminderEmailStoryInner);

export default ReminderEmailStory;
