import React from 'react';

import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import { MinimalStoryInfo } from "ui/types";

interface Props {
    story: MinimalStoryInfo | null;
    href: string;
    backTitle: string;
}

export default function DetailedPostingPageHeader({story, href, backTitle}: Props) {
    if (!href) {
        return null;
    }

    return (
        <PageHeader>
            <h2 className="ms-0">
                <Jump href={story != null ? `${href}?before=${story.moment}` : href}
                      className="btn btn-sm btn-outline-secondary">
                    {"← " + backTitle}
                </Jump>
            </h2>
        </PageHeader>
    );
}
