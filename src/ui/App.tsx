import React from 'react';
import { useSelector } from 'react-redux';

import { isAtNode, isNodeIntroduced } from "state/node/selectors";
import { isAtRemovalPage } from "state/navigation/selectors";
import { getFeedWidth, getPostingBodyFontMagnitude } from "state/settings/selectors";
import EventsFrontend from "ui/events/EventsFrontend";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import MainMenu from "ui/mainmenu/MainMenu";
import CurrentPage from "ui/page/CurrentPage";
import WelcomePage from "ui/welcome/WelcomePage";
import BottomMenu from "ui/bottommenu/BottomMenu";
import GlobalDialogs from "ui/page/GlobalDialogs";
import NodeDialogs from "ui/page/NodeDialogs";
import "./colors.css";
import "./zindex.css";
import "./App.css";

const RemovalPage = React.lazy(() => import("ui/settings/RemovalPage"));

export default function App() {
    const atNode = useSelector(isAtNode);
    const feedWidth = useSelector(getFeedWidth);
    const postingFontMagnitude = useSelector(getPostingBodyFontMagnitude);
    const nodeIntroduced = useSelector(isNodeIntroduced);
    const atRemovalPage = useSelector(isAtRemovalPage);
    return (
        // FIXME React.CSSProperties does not include CSS variables
        <div style={{
            "--feed-width": `${feedWidth}px`,
            "--posting-font-magnitude": `${[postingFontMagnitude]}%`
        } as any}>
            <EventsFrontend/>
            <Navigation/>
            <ErrorPane/>
            <MainMenu/>
            {atRemovalPage ?
                <RemovalPage/>
            :
                (atNode ?
                    <>
                        <CurrentPage/>
                        <NodeDialogs/>
                    </>
                :
                    nodeIntroduced && <WelcomePage/>
                )
            }
            <BottomMenu/>
            <GlobalDialogs/>
        </div>
    );
}
