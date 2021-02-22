import React from 'react';
import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";

const DetailedPostingPageHeader = ({story, href, feedTitle}) => (
    story != null &&
        <PageHeader>
            <Jump href={`${href}?before=${story.moment}`} className="btn btn-sm btn-outline-secondary">
                &larr; {feedTitle}
            </Jump>
        </PageHeader>
);

export default DetailedPostingPageHeader;
