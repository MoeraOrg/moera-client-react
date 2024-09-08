import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { isAtHomeNode } from "state/node/selectors";
import { ExtStoryInfo } from "state/feeds/state";
import { ExtPostingInfo } from "state/postings/state";
import PostingDeleting from "ui/posting/PostingDeleting";
import FeedPosting from "ui/feed/story/FeedPosting";
import SearchReportStory from "ui/feed/story/SearchReportStory";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    story: ExtStoryInfo;
    posting: ExtPostingInfo | null;
    deleting: boolean;
}

export default function FeedStory({nodeName, feedName, story, posting, deleting}: Props) {
    const atHome = useSelector(isAtHomeNode);

    return (
        <div className={cx("posting entry preview", {"not-viewed": atHome && story.viewed === false})}
             data-moment={story.moment} data-viewed={story.viewed !== false}>
            {deleting ?
                <PostingDeleting/>
            :
                <>
                    {(story.storyType === "posting-added" && posting != null) &&
                        <FeedPosting nodeName={nodeName} posting={posting} story={story}/>
                    }
                    {story.storyType === "search-report" && <SearchReportStory feedName={feedName} story={story}/>}
                </>
            }
        </div>
    );
}
