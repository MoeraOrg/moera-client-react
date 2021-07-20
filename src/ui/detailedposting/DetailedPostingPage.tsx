import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Page } from "ui/page/Page";
import { Loading } from "ui/control";
import DetailedPostingPageHeader from "ui/detailedposting/DetailedPostingPageHeader";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference } from "state/postings/selectors";
import { ClientState } from "state/state";
import { PostingInfo } from "api/node/api-types";
import { MinimalStoryInfo } from "ui/types";
import "./DetailedPostingPage.css";

function getStory(posting: PostingInfo, feedName: string): MinimalStoryInfo | null {
    const feedReference = getPostingFeedReference(posting, feedName);
    if (feedReference == null) {
        return null;
    }
    return {
        id: feedReference.storyId,
        ...feedReference
    }
}

function getFeedAndStory(posting: PostingInfo | null): {
    story: MinimalStoryInfo | null, href: string, feedTitle: string
} {
    if (posting == null) {
        return {story: null, href: "", feedTitle: ""};
    }

    let story = getStory(posting, "timeline");
    let href = "/timeline";
    let feedTitle = "Timeline";
    if (story == null) {
        story = getStory(posting, "news");
        href = "/news";
        feedTitle = "News";
    }
    return {story, href, feedTitle};
}

type Props = ConnectedProps<typeof connector>;

function DetailedPostingPage({loading, deleting, posting}: Props) {
    const {story = null, href, feedTitle} = getFeedAndStory(posting);
    return (
        <>
            <DetailedPostingPageHeader story={story} href={href} feedTitle={feedTitle}/>
            <Page>
                {(posting && story) && <DetailedPosting posting={posting} story={story} deleting={deleting}/>}
                {!posting && loading &&
                    <div className="posting">
                        <Loading active={loading}/>
                    </div>
                }
                {!posting && !loading &&
                    <div className="posting-not-found">
                        <FontAwesomeIcon className="icon" icon="frown" size="3x"/>
                        <div className="message">Posting not found or cannot be displayed.</div>
                    </div>
                }
            </Page>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        loading: state.detailedPosting.loading,
        deleting: isDetailedPostingBeingDeleted(state),
        posting: getDetailedPosting(state)
    })
);

export default connector(DetailedPostingPage);
