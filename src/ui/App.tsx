import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { isAtNode, isNodeIntroduced } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isAtGrantPage, isAtRemovalPage } from "state/navigation/selectors";
import { getFeedWidth, getSetting } from "state/settings/selectors";
import EventsFrontend from "ui/events/EventsFrontend";
import Navigation from "ui/navigation/Navigation";
import ErrorPane from "ui/error/ErrorPane";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import CurrentPage from "ui/page/CurrentPage";
import WelcomePage from "ui/welcome/WelcomePage";
import GlobalDialogs from "ui/page/GlobalDialogs";
import NodeDialogs from "ui/page/NodeDialogs";
import { useIsTinyScreen } from "ui/hook";
import "./colors.css";
import "./zindex.css";
import "./App.css";

const RemovalPage = React.lazy(() => import("ui/settings/RemovalPage"));
const GrantPage = React.lazy(() => import("ui/grant/GrantPage"));

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

    const atRemovalPage = useSelector(isAtRemovalPage);
    const atGrantPage = useSelector(isAtGrantPage);
    const atGlobalPage = atRemovalPage || atGrantPage;

    return (
        // FIXME React.CSSProperties does not include CSS variables
        <div style={{
            "--page-header-height": !tinyScreen ? (connectedToHome ? "4.25rem" : "7.75rem") : "4rem",
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
                <>
                    {atRemovalPage && <RemovalPage/>}
                    {atGrantPage && <GrantPage/>}
                </>
            :
                (atNode ?
                    <>
                        <DesktopMainMenu/>
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
