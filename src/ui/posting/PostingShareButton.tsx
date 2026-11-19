import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { openRepostDialog } from "state/repostdialog/actions";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { postingCopyLink } from "state/postings/actions";
import { useDispatcher } from "ui/hook";
import { Icon, msEdit, msLink, msMoreHoriz, msRepeat, msShare } from "ui/material-symbols";
import { DropdownMenu } from "ui/control";
import { ht } from "util/html";
import { REL_HOME } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";
import { ut } from "util/url";

interface Props {
    postingId: string;
    postingOwnerName: string;
    postingOwnerFullName: string | null | undefined;
    postingReceiverName: string | null | undefined;
    postingReceiverFullName: string | null | undefined;
    postingReceiverPostingId: string | null | undefined;
    postingHeading: string;
    postingVisible: PrincipalValue;
}

export default function PostingShareButton({
    postingId,
    postingOwnerName,
    postingOwnerFullName,
    postingReceiverName,
    postingReceiverFullName,
    postingReceiverPostingId,
    postingHeading,
    postingVisible
}: Props) {
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const nodeName = postingReceiverName ?? postingOwnerName;
    const fullName = postingReceiverName == null ? postingOwnerFullName : postingReceiverFullName;
    const id = postingReceiverPostingId ?? postingId;
    const href = ut`/post/${id}`;
    const nodeUri = useSelector((state: ClientState) => getNamingNameNodeUri(state, nodeName));
    const url = universalLocation(null, nodeName, nodeUri, href);
    const sharedText = ht`<p></p><p><a href="${url}">${url}</a></p>`;

    const onCopyLink = () => dispatch(postingCopyLink(id, nodeName));

    const onRepost = () => dispatch(openRepostDialog(nodeName, fullName ?? null, id, postingHeading, postingVisible));

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
