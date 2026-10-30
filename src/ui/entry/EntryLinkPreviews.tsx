import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LinkPreview, MediaAttachment } from "api";
import { EntryLinkPreview } from "ui/entry/EntryLinkPreview";
import { RelNodeName } from "util/rel-node-name";
import "./EntryLinkPreviews.css";
import LinkedPosting from "ui/entry/LinkedPosting";

interface Props {
    nodeName: RelNodeName | string;
    linkPreviews: (LinkPreview | null | undefined)[] | null | undefined;
    noFollow: boolean;
    limit?: number;
    small?: boolean | null;
    media: MediaAttachment[] | null;
}

export default function EntryLinkPreviews({nodeName, linkPreviews, noFollow, limit, small, media}: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const {t} = useTranslation();

    const links = useMemo(
        () => linkPreviews?.filter((lp): lp is LinkPreview => lp != null && lp.ownerName == null),
        [linkPreviews]
    );
    const postings = useMemo(
        () => linkPreviews?.filter((lp): lp is LinkPreview => lp != null && lp.ownerName != null),
        [linkPreviews]
    );

    if (links == null || postings == null) {
        return null;
    }

    const total = links.length + postings.length;

    const onExpand = (e: React.MouseEvent) => {
        setExpanded(!expanded);
        e.preventDefault();
    };

    const max = expanded ? null : limit;

    return (
        <>
            {links.map((linkPreview, index) =>
                (max == null || index < max) &&
                    <EntryLinkPreview
                        key={index}
                        nodeName={nodeName}
                        preview={linkPreview}
                        noFollow={noFollow}
                        media={media ?? null}
                        small={small}
                    />
            )}
            {postings.map((linkPreview, index) =>
                (max == null || (index + links.length) < max) &&
                    <LinkedPosting
                        key={index}
                        preview={linkPreview}
                    />
            )}
            {(limit != null && total > limit) &&
                <>
                    <br/>
                    <button className="entry-link-previews-expand" onClick={onExpand}>
                        {max != null ? "+" : "-"}{t("more-links", {count: total - limit})}
                    </button>
                </>
            }
        </>
    );
}
