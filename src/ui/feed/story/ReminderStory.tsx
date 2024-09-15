import React from 'react';

import { ExtStoryInfo } from "state/feeds/state";
import ReminderAvatarStory from "ui/feed/story/ReminderAvatarStory";
import ReminderEmailStory from "ui/feed/story/ReminderEmailStory";
import ReminderFullNameStory from "ui/feed/story/ReminderFullNameStory";
import ReminderSheriffAllowStory from "ui/feed/story/ReminderSheriffAllowStory";

interface Props {
    feedName: string;
    story: ExtStoryInfo;
}

const ReminderStory = ({feedName, story}: Props) => (
    <>
        {story.storyType === "reminder-avatar" &&
            <ReminderAvatarStory feedName={feedName} story={story}/>
        }
        {story.storyType === "reminder-email" &&
            <ReminderEmailStory feedName={feedName} story={story}/>
        }
        {story.storyType === "reminder-full-name" &&
            <ReminderFullNameStory feedName={feedName} story={story}/>
        }
        {story.storyType === "reminder-sheriff-allow" &&
            <ReminderSheriffAllowStory feedName={feedName} story={story}/>
        }
    </>
);

export default ReminderStory;
