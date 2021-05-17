import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Page } from "ui/page/Page";
import { Loading } from "ui/control";
import DetailedPostingPageHeader from "ui/detailedposting/DetailedPostingPageHeader";
import DetailedPosting from "ui/detailedposting/DetailedPosting";
import { getDetailedPosting, isDetailedPostingBeingDeleted } from "state/detailedposting/selectors";
import { getPostingFeedReference } from "state/postings/selectors";
import "./DetailedPostingPage.css";

function getStory(posting, feedName) {
    const story = getPostingFeedReference(posting, feedName);
    if (story != null) {
        story.id = story.storyId;
    }
    return story;
}

function getFeedAndStory(posting) {
    if (posting == null) {
        return {};
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

function DetailedPostingPage({loading, deleting, posting}) {
    const {story, href, feedTitle} = getFeedAndStory(posting);
    return (
        <>
            <DetailedPostingPageHeader story={story} href={href} feedTitle={feedTitle}/>
            <Page>
                {posting && <DetailedPosting posting={posting} story={story} deleting={deleting}/>}
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

export default connect(
    state => ({
        loading: state.detailedPosting.loading,
        deleting: isDetailedPostingBeingDeleted(state),
        posting: getDetailedPosting(state)
    })
)(DetailedPostingPage);
