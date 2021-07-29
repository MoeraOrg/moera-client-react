import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { getFeedState } from "state/feeds/selectors";
import { PAGE_NEWS } from "state/navigation/pages";
import MainMenuLink from "ui/mainmenu/MainMenuLink";

type Props = ConnectedProps<typeof connector>;

function MainMenuNewsLink({anchor}: Props) {
    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page={PAGE_NEWS} href={href}>NEWS</MainMenuLink>
}

const connector = connect(
    (state: ClientState) => ({
        anchor: getFeedState(state, "news").anchor
    })
);

export default connector(MainMenuNewsLink);
