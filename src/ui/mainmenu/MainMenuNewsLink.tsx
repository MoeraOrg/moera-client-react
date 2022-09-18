import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { PAGE_NEWS } from "state/navigation/pages";
import MainMenuLink from "ui/mainmenu/MainMenuLink";
import { getFeedTitle } from "ui/feed/feeds";

type Props = ConnectedProps<typeof connector>;

function MainMenuNewsLink({anchor}: Props) {
    const {t} = useTranslation();

    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page={PAGE_NEWS} href={href}>{getFeedTitle("news", t)}</MainMenuLink>
}

const connector = connect(
    (state: ClientState) => ({
        anchor: getFeedState(state, "news").anchor
    })
);

export default connector(MainMenuNewsLink);
