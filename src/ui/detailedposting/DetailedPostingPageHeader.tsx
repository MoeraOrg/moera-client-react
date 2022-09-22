import React from 'react';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { MinimalStoryInfo } from "ui/types";

interface Props {
    story: MinimalStoryInfo | null;
    href: string;
    feedTitle: string;
}

const DetailedPostingPageHeader = ({story, href, feedTitle}: Props) => {
    const {t} = useTranslation();

    if (story == null) {
        return null;
    }

    return (
        <PageHeader>
            <h2 className="ms-0">
                <Jump href={`${href}?before=${story.moment}`} className="btn btn-sm btn-outline-secondary">
                    {t("back-to-feed", {feed: feedTitle})}
                </Jump>
            </h2>
        </PageHeader>
    );
}

export default DetailedPostingPageHeader;
