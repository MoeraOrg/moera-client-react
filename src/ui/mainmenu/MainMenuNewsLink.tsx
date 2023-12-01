import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { PAGE_NEWS } from "state/navigation/pages";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import { getFeedTitle } from "ui/feed/feeds";

export default function MainMenuNewsLink() {
    const anchor = useSelector((state: ClientState) => getFeedState(state, "news").anchor);
    const {t} = useTranslation();

    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page={PAGE_NEWS} href={href}>{getFeedTitle("news", t)}</MainMenuLink>
}
