import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode, isNodeIntroduced } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { GLOBAL_PAGES } from "state/navigation/pages";
import { getFeedWidth, getSetting } from "state/settings/selectors";
import EventsFrontend from "ui/events/EventsFrontend";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import GlobalPage from "ui/page/GlobalPage";
import CurrentPage from "ui/page/CurrentPage";
import WelcomePage from "ui/welcome/WelcomePage";
import GlobalDialogs from "ui/page/GlobalDialogs";
import NodeDialogs from "ui/page/NodeDialogs";
import { useIsTinyScreen } from "ui/hook";
import "./colors.css";
import "./zindex.css";
import "./App.css";

export default function App() {
    const tinyScreen = useIsTinyScreen();

    const atNode = useSelector(isAtNode);
    const feedWidth = useSelector(getFeedWidth);
    const postingFontMagnitude = useSelector((state: ClientState) =>
        getSetting(state, tinyScreen ? "posting.body.font-magnitude.mobile" : "posting.body.font-magnitude") as number
    );
    const bottomMenuStyle = useSelector((state: ClientState) => getSetting(state, "bottom-menu.style") as string);
    const nodeIntroduced = useSelector(isNodeIntroduced);
    const connectedToHome = useSelector(isConnectedToHome);

    const atGlobalPage = useSelector((state: ClientState) => GLOBAL_PAGES.includes(state.navigation.page));

    return (
        // FIXME React.CSSProperties does not include CSS variables
        <div style={{
            "--page-header-height": !tinyScreen ? (connectedToHome || atGlobalPage ? "4.25rem" : "7.75rem") : "4rem",
            "--page-footer-height": !tinyScreen
                ? "0"
                : (connectedToHome ? (bottomMenuStyle === "compact" ? "3rem" : "5rem") : "3.5rem"),
            "--feed-width": `${feedWidth}px`,
            "--posting-font-magnitude": `${[postingFontMagnitude]}%`
        } as any}>
            <EventsFrontend/>
            <Navigation/>
            <ErrorPane/>
            {atGlobalPage ?
                <GlobalPage/>
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
            <GlobalDialogs/>
        </div>
    );
}
