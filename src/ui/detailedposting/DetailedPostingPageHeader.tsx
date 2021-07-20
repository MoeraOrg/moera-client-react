import React from 'react';

import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { FeedReference } from "api/node/api-types";

interface Props {
    story: FeedReference | null;
    href: string;
    feedTitle: string;
}

const DetailedPostingPageHeader = ({story, href, feedTitle}: Props) => (
    story != null ?
        <PageHeader>
            <Jump href={`${href}?before=${story.moment}`} className="btn btn-sm btn-outline-secondary">
                &larr; {feedTitle}
            </Jump>
        </PageHeader>
    :
        null
);

export default DetailedPostingPageHeader;
