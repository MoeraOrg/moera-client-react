import React from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { AvatarInfo } from "api";
import { ExtStoryInfo } from "state/feeds/state";
import { reminderAvatarUpdate } from "state/stories/actions";
import AvatarEditor from "ui/profile/edit/avatar/AvatarEditor";
import StoryMenu from "ui/story/StoryMenu";
import StoryPin from "ui/story/StoryPin";
import store from "state/store";

interface OuterProps {
    feedName: string;
    story: ExtStoryInfo;
}

interface Values {
    avatar: AvatarInfo | null;
}

type Props = OuterProps & FormikProps<Values>;

function ReminderAvatarStoryInner({feedName, story, submitForm}: Props) {
    const {t} = useTranslation();

    const onChange = () => submitForm();

    return (
        <>
            <StoryMenu story={{...story, feedName}}/>
            <StoryPin pinned={story.pinned}/>
            <div className="content me-3">
                <p>
                    <Trans i18nKey="why-not-set-avatar">
                        <span className="fs-5 fw-bold me-2"/>
                    </Trans>
                </p>
                <p>{t("want-set-right-now-click-circle")}</p>
                <Form>
                    <AvatarEditor name="avatar" onChange={onChange}/>
                </Form>
                <p className="ms-2 text-body-tertiary">{t("new-avatar-new-posts")}</p>
            </div>
        </>
    );
}

const reminderAvatarStoryLogic = {

    mapPropsToValues: (): Values => ({
        avatar: null
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        if (values.avatar != null) {
            store.dispatch(reminderAvatarUpdate(values.avatar.id));
        }
    }

};

const ReminderAvatarStory = withFormik(reminderAvatarStoryLogic)(ReminderAvatarStoryInner);

export default ReminderAvatarStory;
