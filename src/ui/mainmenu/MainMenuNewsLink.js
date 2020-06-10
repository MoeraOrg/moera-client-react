import React from 'react';
import { connect } from 'react-redux';

import { getFeedState } from "state/feeds/selectors";
import { PAGE_NEWS } from "state/navigation/pages";
import MainMenuLink from "ui/mainmenu/MainMenuLink";

const MainMenuNewsLink = ({anchor}) => {
    const href = anchor != null ? `/news?before=${anchor}` :"/news";
    return <MainMenuLink page={PAGE_NEWS} href={href}>NEWS</MainMenuLink>
}

export default connect(
    state => ({
        anchor: getFeedState(state, "news").anchor
    })
)(MainMenuNewsLink);
