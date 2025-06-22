import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { getHomeOwnerGender } from "state/home/selectors";
import { ExtStoryInfo } from "state/feeds/state";
import { reminderSheriffAllow } from "state/stories/actions";
import { Button } from "ui/control";
import StoryMenu from "ui/story/StoryMenu";
import StoryBadges from "ui/story/StoryBadges";

interface Props {
    feedName: string;
    story: ExtStoryInfo;
}

function ReminderSheriffAllowStory({feedName, story}: Props) {
    const gender = useSelector(getHomeOwnerGender);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [submitting, setSubmitting] = useState<boolean>(false);

    const onClick = () => {
        setSubmitting(true);
        dispatch(reminderSheriffAllow());
    }

    return (
        <>
            <StoryMenu story={{...story, feedName}}/>
            <StoryBadges pinned={story.pinned}/>
            <div className="content me-3">
                <p>
                    <Trans i18nKey="do-want-allow-android-google-play">
                        <span className="fs-5 fw-bold me-2"/>
                    </Trans>
                </p>
                <p className="text-center">
                    <Button variant="primary" type="submit" loading={submitting}
                            onClick={onClick}>{t("i-agree", {gender})}</Button>
                </p>
            </div>
        </>
    );
}

export default ReminderSheriffAllowStory;
