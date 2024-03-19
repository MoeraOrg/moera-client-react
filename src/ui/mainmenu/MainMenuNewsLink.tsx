import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import { getFeedTitle } from "ui/feed/feeds";
import { REL_CURRENT } from "util/rel-node-name";

export default function MainMenuNewsLink() {
    const anchor = useSelector((state: ClientState) => getFeedState(state, REL_CURRENT, "news").anchor);
    const {t} = useTranslation();

    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page="news" href={href}>{getFeedTitle("news", t)}</MainMenuLink>
}
