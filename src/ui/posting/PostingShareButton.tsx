import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { openRepostDialog } from "state/repostdialog/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { postingCopyLink } from "state/postings/actions";
import { getSetting } from "state/settings/selectors";
import { useDispatcher } from "ui/hook";
import { Icon, msEdit, msLink, msMoreHoriz, msRepeat, msReplySolid, msShare } from "ui/material-symbols";
import { DropdownMenu } from "ui/control";
import { ht, htmlEntities } from "util/html";
import { formatFullName } from "util/names";
import { REL_HOME } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";
import { ut } from "util/url";

interface Props {
    posting: PostingInfo;
}

export default function PostingShareButton({posting}: Props) {
    const subjectPrefix = useSelector((state: ClientState) =>
        getSetting(state, "posting.reply.subject-prefix") as string
    );
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const nodeName = posting.receiverName ?? posting.ownerName;
    const fullName = posting.receiverName == null ? posting.ownerFullName : posting.receiverFullName;
    const postingVisible =
        (posting.receiverName != null ? posting.receiverOperations?.view : posting.operations?.view) ?? "public";
    const displayName = formatFullName(nodeName, fullName);
    const nodeHref = universalLocation(null, nodeName, null, "/");
    const id = posting.receiverPostingId ?? posting.id;
    const href = ut`/post/${id}`;
    const nodeUri = useSelector((state: ClientState) => getNamingNameNodeUri(state, nodeName));
    const url = universalLocation(null, nodeName, nodeUri, href);
    const sharedText = ht`<p></p><p><a href="${url}">${url}</a></p>`;
    const quoteSubject = replySubject(posting.body.subject, subjectPrefix);
    const quotePreamble = '<p>'
        + t("reply-to-post", {name: htmlEntities(displayName)})
            .replace("<0>", ht`<a href="${url}">`)
            .replace("<1>", ht`<a href="${nodeHref}" data-nodename="${nodeName}" data-href="/">`)
            .replace(/<\/[01]>/g, "</a>")
        + '</p>';
    const quotedText = quotePreamble + (posting.body.text ? `<blockquote>${posting.body.text}</blockquote>` : "");

    const onCopyLink = () => dispatch(postingCopyLink(id, nodeName));

    const onRepost = () => dispatch(openRepostDialog(nodeName, fullName ?? null, id, posting.heading, postingVisible));

    const onShare = () => dispatch(shareDialogPrepare(nodeName, href));

    return (
        <DropdownMenu items={[
            {
                icon: msLink,
                title: t("copy-link"),
                nodeName,
                href,
                onClick: onCopyLink,
                show: true
            },
            {
                divider: true
            },
            {
                icon: msRepeat,
                title: t("repost"),
                nodeName,
                href,
                onClick: onRepost,
                show: true
            },
            {
                icon: msEdit,
                title: t("share-and-write"),
                nodeName: REL_HOME,
                href: ut`/compose?type=html&text=${sharedText}`,
                show: true
            },
            {
                icon: msReplySolid,
                title: t("quote-and-reply"),
                nodeName: REL_HOME,
                href: ut`/compose?type=html&text=${quotedText}&subject=${quoteSubject}&nolinkpreviews=true`,
                show: true
            },
            {
                divider: true
            },
            {
                icon: msMoreHoriz,
                title: t("more"),
                nodeName,
                href,
                onClick: onShare,
                show: true
            }
        ]} className="posting-button">
            <Icon icon={msShare} size="1.2em"/>
            <span className="caption">{t("share")}</span>
        </DropdownMenu>
    );
}

function replySubject(subject?: string | null, subjectPrefix?: string | null): string {
    if (!subject || !subjectPrefix) {
        return subject ?? "";
    }
    if (!subject.startsWith(subjectPrefix)) {
        return subjectPrefix + " " + subject;
    }
    const tail = subject.substring(subjectPrefix.length);
    const m = tail.match(/^\s*\[(\d+)]\s+(.*)$/);
    if (m == null) {
        return subjectPrefix + "[2]" + tail;
    }
    return subjectPrefix + "[" + (parseInt(m[1]) + 1) + "] " + m[2];
}
