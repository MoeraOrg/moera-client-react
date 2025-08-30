import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { getFeedState } from "state/feeds/selectors";
import MainMenuLink from "ui/mainmenu/pages/MainMenuLink";
import { getFeedTitle } from "ui/feed/feeds";
import { REL_CURRENT } from "util/rel-node-name";

export default function MainMenuNewsLink() {
    const atHome = useSelector(isAtHomeNode);
    const anchor = useSelector((state: ClientState) => getFeedState(state, REL_CURRENT, "news").anchor);
    const {t} = useTranslation();

    if (!atHome) {
        return null;
    }

    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page="news" href={href}>{getFeedTitle("news", t)}</MainMenuLink>
}
