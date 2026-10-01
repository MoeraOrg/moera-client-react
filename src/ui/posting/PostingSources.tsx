import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { Icon, MaterialSymbol, msRepeat, msStar } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import NodeName from "ui/nodename/NodeName";
import { getFeedTitle } from "ui/feed/feeds";
import { getNodeSourceIcon } from "util/node-source-icons";
import { ut } from "util/url";
import "./PostingSources.css";

interface Props {
    posting: PostingInfo;
}

export default function PostingSources({posting}: Props) {
    const openInNewWindow = useSelector((state: ClientState) => getSetting(state, "link.new-window") as boolean);
    const {t} = useTranslation();

    const externalSourceUri = posting.externalSourceUri != null && posting.externalSourceUri.length > 0
        ? posting.externalSourceUri[0]
        : null;
    const externalSourceIcon: MaterialSymbol | null = getNodeSourceIcon(externalSourceUri);

    const list = useMemo(() => sourcesList(posting, t), [posting, t]);

    return (
        <div className="posting-sources">
            <div className="title">{t("where-from")}</div>
            {externalSourceUri != null &&
                <a className="source" href={externalSourceUri}
                   target={openInNewWindow ? "_blank" : undefined} rel="noreferrer">
                    {externalSourceIcon != null &&
                        <span className="icon external-source">
                            <Icon icon={externalSourceIcon} size="1.1em"/>
                        </span>
                    }
                    <span className="external-source-url">{externalSourceUri}</span>
                </a>
            }
            {list.map((line, index) =>
                <Jump nodeName={line.nodeName} href={ut`/post/${line.postingId}`} className="source" key={index}>
                    <span className={cx("icon", {"original": line.original})}>
                        <Icon icon={line.original ? msStar : msRepeat} size="1.2em"/>
                    </span>
                    <NodeName name={line.nodeName} fullName={line.fullName} sourceUri={line.sourceUri}
                              linked={false} popup={false}/>
                </Jump>
            )}
        </div>
    );
}

interface SourcesLine {
    nodeName: string;
    fullName: string | null;
    sourceUri: string | null;
    feedTitle: string;
    postingId: string | null;
    original: boolean;
}

function sourcesList(posting: PostingInfo, t: TFunction): SourcesLine[] {
    if (posting.sources == null) {
        return [];
    }

    const list: SourcesLine[] = posting.sources
        .filter(sr => sr.nodeName !== posting.receiverName || sr.postingId !== posting.receiverPostingId)
        .sort((sr1, sr2) => sr1.createdAt - sr2.createdAt)
        .map(sr => ({
            nodeName: sr.nodeName,
            fullName: sr.fullName ?? null,
            sourceUri: sr.nodeSourceUri ?? null,
            feedTitle: getFeedTitle(sr.feedName, t),
            postingId: sr.postingId,
            original: false
        }));

    const receiverFeedName = posting.sources
        .find(sr => sr.nodeName === posting.receiverName && sr.postingId === posting.receiverPostingId)
        ?.feedName;
    if (receiverFeedName != null && posting.receiverName != null) {
        list.unshift({
            nodeName: posting.receiverName,
            fullName: posting.receiverFullName ?? null,
            sourceUri: posting.receiverSourceUri ?? null,
            feedTitle: getFeedTitle(receiverFeedName, t),
            postingId: posting.receiverPostingId ?? null,
            original: true
        });
    }

    return list;
}
