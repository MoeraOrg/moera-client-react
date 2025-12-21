import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { searchEntryCopyLink } from "state/search/actions";
import { ExtSearchEntryInfo } from "state/search/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { DropdownMenu, DropdownMenuItems } from "ui/control";
import { REL_CURRENT } from "util/rel-node-name";
import { ut } from "util/url";
import "ui/entry/EntryMenu.css";

interface Props {
    entry: ExtSearchEntryInfo;
}

function SearchEntryMenuItems({entry}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const entryHref = entry.commentId == null
        ? ut`/post/${entry.postingId}`
        : ut`/post/${entry.postingId}?comment=${entry.commentId}`;

    const onCopyLink = () => dispatch(searchEntryCopyLink(entry.nodeName, entry.postingId, entry.commentId ?? null));

    const onShare = () => dispatch(shareDialogPrepare(entry.nodeName, entryHref));

    return (
        <DropdownMenuItems items={[
            {
                title: t("copy-link"),
                nodeName: REL_CURRENT,
                href: entryHref,
                onClick: onCopyLink,
                show: true
            },
            {
                title: t("share"),
                nodeName: REL_CURRENT,
                href: entryHref,
                onClick: onShare,
                show: true
            }
        ]}/>
    );
}

const SearchEntryMenu = ({entry}: Props) =>
    <DropdownMenu content={
        <SearchEntryMenuItems entry={entry}/>
    }/>;

export default SearchEntryMenu;
