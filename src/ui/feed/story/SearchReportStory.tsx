import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ExtStoryInfo } from "state/feeds/state";
import StoryMenu from "ui/story/StoryMenu";
import StoryBadges from "ui/story/StoryBadges";
import StorySubject from "ui/story/StorySubject";
import StoryDate from "ui/story/StoryDate";
import { interceptLinkClick } from "ui/entry/link-click-intercept";

const COLLAPSED_LENGTH = 5;

interface Props {
    feedName: string;
    story: ExtStoryInfo;
}

export default function SearchReportStory({feedName, story}: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent) => interceptLinkClick(event);

    const onExpandClick = () => setExpanded(!expanded);

    const clicks = story.summaryData?.clicks ?? [];

    return (
        <>
            <StoryMenu story={{...story, feedName}}/>
            <StoryBadges pinned={story.pinned}/>
            <div className="owner-line">
                <div className="owner-info">
                    <StoryDate publishedAt={story.publishedAt}/>
                </div>
            </div>
            <StorySubject subjectHtml={t("popularity-blog-search")}/>
            <div className="content">
                <p>{t("how-often-blog-search")}</p>
                <ul>
                    {clicks.map((page, index) =>
                        (index < COLLAPSED_LENGTH || expanded) &&
                            <li key={index}>
                                <a href={page.href} onClick={onClick}>{page.heading ?? t("blog.itself")}</a> &mdash;
                                {" " + t("visits", {count: page.clicks})}
                            </li>
                    )}
                </ul>
                {clicks.length > COLLAPSED_LENGTH &&
                    <span className="btn btn-link read-more" onClick={onExpandClick}>
                        {expanded ? t("collapse") : t("expand")}
                    </span>
                }
            </div>
        </>
    );
}
