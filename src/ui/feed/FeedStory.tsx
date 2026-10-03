import React, { Suspense } from 'react';
import cx from 'classnames';

import { ExtStoryInfo } from "state/feeds/state";
import { ExtPostingInfo } from "state/postings/state";
import PostingDeleting from "ui/posting/PostingDeleting";
import FeedPosting from "ui/feed/story/FeedPosting";
import SearchReportStory from "ui/feed/story/SearchReportStory";
import { RelNodeName } from "util/rel-node-name";
import { Loading } from "ui/control";
import { getFeedProperties } from "ui/feed/feeds";

const ReminderStory = React.lazy(() => import("ui/feed/story/ReminderStory"));

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    story: ExtStoryInfo;
    posting: ExtPostingInfo | null;
    deleting: boolean;
}

export default function FeedStory({nodeName, feedName, story, posting, deleting}: Props) {
    const {markNotViewed} = getFeedProperties(feedName);

    return (
        <article className={cx("posting entry preview", {"not-viewed": markNotViewed && story.viewed === false})}
             data-moment={story.moment} data-viewed={story.viewed !== false}>
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    {(story.storyType === "posting-added" && posting != null) &&
                        <FeedPosting
                            nodeName={nodeName}
                            posting={posting}
                            feedName={feedName}
                            story={story}
                        />
                    }
                    {story.storyType.startsWith("reminder-") &&
                        <Suspense fallback={<Loading/>}>
                            <ReminderStory feedName={feedName} story={story}/>
                        </Suspense>
                    }
                    {story.storyType === "search-report" &&
                        <SearchReportStory feedName={feedName} story={story}/>
                    }
                </>
            }
        </article>
    );
}
